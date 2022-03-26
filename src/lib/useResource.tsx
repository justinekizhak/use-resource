import { useState, useEffect, useCallback, useRef } from "react";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance
} from "axios";

import type {
  DebugObject,
  OnSuccessType,
  BeforeEventType,
  EventType,
  OnFailureType,
  OnFinishType,
  NextCallbackType,
  BaseConfigType,
  AccumulatorType,
  ResourceType,
  ValueOf_ResourceType
} from "./types/main.type";
import { GlobalResourceContext } from "./resourceContext/context";
import type {
  UseResourceOptionsType,
  UseResourceReturnType
} from "./types/useResource.type";

import {
  defaultLoadingComponent,
  defaultErrorComponent,
  defaultFetchingComponent,
  containerFactory
} from "./utils/defaultComponents";

import {
  getBaseConfig,
  getTriggerDependencies,
  getMessageQueueData,
  pushToAcc,
  useIsMounted
} from "./utils/helpers";

import { useDispatch, usePublish, useSelector } from "./resourceContext/hooks";

import { refetchFunction } from "./utils/refetch";

/**
 *
 * @param baseConfig The request config for the API request.
 * @param resourceName The name of the resource.
 * This is required if you want to use the ResourceContext.
 * This is how we can identify the resource in the store and it should be unique throughout a ResourceContext.
 * @param options All the options and flags available for the resource.
 * @returns Returns an object containing the following properties:
 *    1. data
 *    2. isLoading
 *    3. isFetching
 *    4. errorData
 *    5. errorMessage
 *    6. refetch
 *    7. debug
 *    8. cancel
 *    9. Container
 */
export function useResource<T>(
  baseConfig: BaseConfigType,
  resourceName: string = "resource",
  options: UseResourceOptionsType<T> = {}
): UseResourceReturnType<T> {
  const {
    CustomContext = GlobalResourceContext,
    triggerOn = "",
    onMountCallback = (customAxios: AxiosInstance) => {},
    globalLoadingComponent = defaultLoadingComponent,
    globalFetchingComponent = defaultFetchingComponent,
    globalErrorComponent = defaultErrorComponent,
    useMessageQueue = false,
    useGlobalContext = false,
    devMode = false,
    deps = []
  } = options;

  // Counter is used for force-refreshing the parent component
  const [_, setCounter] = useState(0);

  // All the data is stored in refs, this will prevent any unnecessary re-rendering
  const data = useRef<T>();
  const isLoading = useRef(false);
  const isFetching = useRef(false);
  const errorData = useRef<AxiosError | AxiosResponse>();
  const errorMessage = useRef("");
  const debug = useRef<DebugObject[]>([]);

  // Internal states here
  const firstTime = useRef(true);
  const axiosInstance = useRef<AxiosInstance>(axios);
  const controllerInstance = useRef<AbortController>();
  const defaultConfigRef = useRef<AxiosRequestConfig>(
    getBaseConfig(baseConfig)
  );
  const baseConfigRef = useRef(baseConfig);
  const accumulator = useRef<AccumulatorType>([]);

  // Custom hooks here
  const isMounted = useIsMounted();
  const dispatch = useDispatch(CustomContext);

  // Here _contextData is of ResourceType as we are not passing any data key.
  const _contextData = useSelector(resourceName, undefined, CustomContext);
  const contextData = _contextData as ResourceType<T>;

  const publish = usePublish(CustomContext);

  const useRequestChaining = Array.isArray(baseConfig);
  if (useRequestChaining && baseConfig.length === 0) {
    throw new Error("Please pass in the request config");
  }

  // Data refs here

  const setData = (value: T | undefined) => {
    data.current = value;
  };

  const setIsLoading = (value: boolean) => {
    isLoading.current = value;
  };

  const setIsFetching = (value: boolean) => {
    isFetching.current = value;
  };

  const setErrorData = (value: AxiosError | AxiosResponse | undefined) => {
    errorData.current = value;
  };

  const setErrorMessage = (value: string = "") => {
    errorMessage.current = value;
  };

  // End of data refs

  const [triggerDeps, isMountTriggerable] = getTriggerDependencies(
    triggerOn,
    defaultConfigRef.current
  );

  const [isMessageQueueAvailable] = getMessageQueueData(
    useMessageQueue,
    resourceName
  );

  const forceRefresh = useCallback(() => {
    if (isMounted.current && !useGlobalContext) {
      setCounter((prev) => prev + 1);
    }
  }, [useGlobalContext]);

  const defaultNext: NextCallbackType = (data) => {
    if (data) {
      accumulator.current.push(data);
    }
    return accumulator;
  };

  const pushToDebug = useCallback(
    (message: string = "", data: object | null = null) => {
      if (devMode) {
        console.log(message, data);
      }
      const timestamp = Date.now() + "";
      const fullData: DebugObject = { timestamp, message };
      if (data) {
        fullData["data"] = data;
      }
      debug.current.push(fullData);
    },
    [devMode]
  );

  const pushToMessageQueue = useCallback(
    (data) => {
      pushToDebug("PUSHING TO MESSAGE QUEUE: ", data);
      publish(data);
    },
    [pushToDebug, publish]
  );

  useEffect(() => {
    const controller = new AbortController();
    const customAxios = axios.create();
    axiosInstance.current = customAxios;
    controllerInstance.current = controller;

    const cleanup = onMountCallback(customAxios);
    return cleanup;
  }, [onMountCallback]);

  const triggerDepString = JSON.stringify(triggerDeps);

  const configDepString = JSON.stringify(deps);

  const updateGlobalState = useCallback(
    (data) => {
      if (useGlobalContext) {
        dispatch(resourceName, data);
      }
    },
    [useGlobalContext, resourceName, dispatch]
  );

  const beforeEvent: BeforeEventType = useCallback(
    (acc = accumulator, next = defaultNext, disableStateUpdate = false) => {
      pushToDebug("[FETCHING RESOURCE] BEFORE TASK");
      if (!disableStateUpdate) {
        // isLoading is set only for the first time
        // Rest all the times we should be using isFetching
        const _isLoading = firstTime.current;
        firstTime.current = false;
        updateGlobalState({
          isLoading: _isLoading,
          data: {},
          errorData: "",
          isFetching: true
        });
        setIsLoading(_isLoading);
        setIsFetching(true);
        setData(undefined);
        setErrorData(undefined);
        setErrorMessage();
        forceRefresh();
      }
    },
    [pushToDebug, updateGlobalState]
  );

  const event: EventType = useCallback(
    async (customConfig, acc = accumulator, next = defaultNext) => {
      const axiosConfig = {
        signal: controllerInstance.current?.signal,
        ...defaultConfigRef.current,
        ...customConfig
      };
      pushToDebug("[FETCHING RESOURCE] TASK TRIGGERED", axiosConfig);
      pushToAcc(next, axiosConfig);
      const res = await axiosInstance.current(axiosConfig);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      return res;
    },
    [pushToDebug]
  );

  const onSuccess: OnSuccessType = useCallback(
    (
      res,
      acc = accumulator,
      next = defaultNext,
      disableStateUpdate = false
    ) => {
      const _res: AxiosResponse = res;
      const _data = _res?.data;
      if (!disableStateUpdate) {
        updateGlobalState({ data: _data });
        setData(_data);
        forceRefresh();
      }
      pushToAcc(next, _res);
      pushToDebug("[FETCHING RESOURCE] TASK SUCCESS", _res);
    },
    [pushToDebug, updateGlobalState]
  );

  const onFailure: OnFailureType = useCallback(
    (error, acc = accumulator, next = defaultNext) => {
      if (!error) {
        return;
      }
      const _error: AxiosError = error;
      pushToAcc(next, _error);
      if (_error.response) {
        pushToDebug(
          "[FETCHING RESOURCE] RESPONSE ERROR RECEIVED",
          _error.response
        );
        const _errMsg = _error?.response?.statusText;
        updateGlobalState({
          errorData: _error.response,
          errorMessage: _errMsg
        });
        setErrorData(_error.response);
        setErrorMessage(_errMsg);
      } else if (_error.request) {
        pushToDebug(
          "[FETCHING RESOURCE] REQUEST ERROR RECEIVED",
          _error.request
        );
        const _errMsg = _error?.request?.statusText;
        updateGlobalState({ errorData: _error.request, errorMessage: _errMsg });
        setErrorData(_error.request);
        setErrorMessage(_errMsg);
      } else {
        pushToDebug("[FETCHING RESOURCE] SYSTEM ERROR RECEIVED", error);
        const _errMsg = _error?.message;
        updateGlobalState({ errorData: _error, errorMessage: _errMsg });
        setErrorData(_error);
        setErrorMessage(_errMsg);
      }
      forceRefresh();
    },
    [pushToDebug, updateGlobalState]
  );

  const onFinish: OnFinishType = useCallback(
    (acc, next, disableStateUpdate = false) => {
      pushToDebug("[FETCHING RESOURCE] TASK END", acc);
      if (!disableStateUpdate) {
        updateGlobalState({ isLoading: false, isFetching: false });
        setIsLoading(false);
        setIsFetching(false);
        forceRefresh();
      }
    },
    [pushToDebug, updateGlobalState]
  );

  const refetch = useCallback(
    (customConfig?: BaseConfigType) =>
      refetchFunction({
        accumulator,
        defaultNext,
        beforeEvent,
        event,
        onSuccess,
        onFailure,
        onFinish,
        isMessageQueueAvailable,
        pushToMessageQueue,
        useRequestChaining,
        baseConfigRef,
        controllerInstance,
        resourceName
      })(customConfig),
    [
      beforeEvent,
      event,
      onSuccess,
      onFailure,
      onFinish,
      isMessageQueueAvailable,
      pushToMessageQueue,
      useRequestChaining,
      resourceName
    ]
  );

  /**
   * This function wil run when trigger or config deps is updated.
   */
  const onMountTrigger = useCallback(() => {
    pushToDebug("INITIALIZING");
    if (isMountTriggerable) {
      pushToDebug("ON MOUNT TRIGGERING");
      refetch();
    } else {
      pushToDebug("SKIPPING ON MOUNT TRIGGER");
    }
  }, [isMountTriggerable, pushToDebug, refetch]);

  /**
   * This is to keep track if the trigger deps is updated.
   * If it is updated then we need skip the refetch in the config deps trigger.
   * Otherwise if the user is using both trigger and config deps, and if both are
   * changed then there will be 2 refetches.
   */
  const oldTriggerDepString = useRef(triggerDepString);

  /**
   * Config updated. Re initialize.
   */
  useEffect(() => {
    pushToDebug("CONFIG DEPS UPDATED. RE-INITIALIZE.");
    baseConfigRef.current = baseConfig;
    defaultConfigRef.current = getBaseConfig(baseConfig);

    // Is trigger deps updated
    // If updated then dont trigger on mount
    // Because the triggerDeps useEffect will run, so we can safely skip this refetch.
    const triggerDepsChanged = oldTriggerDepString.current !== triggerDepString;
    if (!triggerDepsChanged) {
      onMountTrigger();
    }
  }, [configDepString, onMountTrigger, pushToDebug]);

  /**
   * Run this useEffect when the hook is mounted or if the deps changes.
   */
  useEffect(() => {
    // Check if the trigger deps has changed and run it.
    const triggerDepsChanged = oldTriggerDepString.current !== triggerDepString;
    if (triggerDepsChanged) {
      // Update the old trigger deps string
      oldTriggerDepString.current = triggerDepString;
      onMountTrigger();
    }
  }, [triggerDepString, onMountTrigger]);

  const cancel = useCallback(() => {
    controllerInstance.current?.abort();
  }, []);

  // Cancel the API call if the hook is unmounted
  useEffect(() => {
    if (!isMounted.current) {
      cancel();
    }
  }, [isMounted.current]);

  useEffect(() => {
    updateGlobalState({ refetch, debug, cancel });
  }, [refetch, debug, cancel, updateGlobalState]);

  // Getters for fetching the data from context
  const getIsLoading = () => {
    if (useGlobalContext) {
      return contextData?.isLoading;
    }
    return isLoading.current;
  };
  const getIsFetching = () => {
    if (useGlobalContext) {
      return contextData?.isFetching;
    }
    return isFetching.current;
  };
  const getData = () => {
    if (useGlobalContext) {
      return contextData?.data;
    }
    return data.current;
  };

  const getErrorData = () => {
    if (useGlobalContext) {
      return contextData?.errorData;
    }
    return errorData.current;
  };

  const getErrorMessage = () => {
    if (useGlobalContext) {
      return contextData?.errorMessage;
    }
    return errorMessage.current;
  };
  // End of getters

  const Container = containerFactory({
    globalLoadingComponent,
    globalFetchingComponent,
    globalErrorComponent,
    isLoading: getIsLoading(),
    isFetching: getIsFetching(),
    data: getData(),
    errorData: getErrorData(),
    errorMessage: getErrorMessage(),
    resourceName
  });

  const returnObject = {
    isLoading: getIsLoading(),
    isFetching: getIsFetching(),
    data: getData(),
    errorData: getErrorData(),
    errorMessage: getErrorMessage(),
    refetch,
    debug,
    cancel,
    Container
  };
  return returnObject;
}
