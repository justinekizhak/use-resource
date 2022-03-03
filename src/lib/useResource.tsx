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
  AccumulatorType
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
  pushToAcc
} from "./utils/helpers";

import { useDispatch, usePublish } from "lib/resourceContext/hooks";

import { refetchFunction } from "./utils/refetch";

/**
 * Input parameters:
 * 1. baseConfig,
 * 2. resourceName
 * 3. options
 *
 *
 * Returns:
 * 1. data
 * 2. isLoading
 * 3. errorMessage
 * 4. refetch
 * 5. debug
 * 6. cancel
 * 7. Container
 * 8. isFetching
 */
export function useResource<T>(
  baseConfig: BaseConfigType,
  resourceName: string = "resource",
  options: UseResourceOptionsType<T> = {}
): UseResourceReturnType<T> {
  const {
    CustomContext = GlobalResourceContext,
    triggerOn = "onMount",
    onMountCallback = (customAxios: AxiosInstance) => {},
    globalLoadingComponent = defaultLoadingComponent,
    globalFetchingComponent = defaultFetchingComponent,
    globalErrorComponent = defaultErrorComponent,
    useMessageQueue = false,
    useGlobalContext = false,
    devMode = false
  } = options;

  const useRequestChaining = Array.isArray(baseConfig);
  if (useRequestChaining && baseConfig.length === 0) {
    throw new Error("Please pass in the request config");
  }
  const defaultConfig = getBaseConfig(baseConfig);

  const dispatch = useDispatch(CustomContext);
  const publish = usePublish(CustomContext);

  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const firstTime = useRef(true);
  const [errorData, setErrorData] = useState<AxiosError | AxiosResponse>();
  const debug = useRef<DebugObject[]>([]);
  const axiosInstance = useRef<AxiosInstance>(axios);
  const controllerInstance = useRef<AbortController>(new AbortController());
  const defaultConfigRef = useRef<AxiosRequestConfig>(defaultConfig);
  const baseConfigRef = useRef(baseConfig);
  const accumulator = useRef<AccumulatorType>([]);

  const [triggerDeps, isMountTriggerable] = getTriggerDependencies(
    triggerOn,
    defaultConfigRef.current
  );

  const [isMessageQueueAvailable] = getMessageQueueData(
    useMessageQueue,
    resourceName
  );

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
      }
    },
    [pushToDebug, updateGlobalState]
  );

  const event: EventType = useCallback(
    async (customConfig, acc = accumulator, next = defaultNext) => {
      const axiosConfig = {
        signal: controllerInstance.current.signal,
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
      const _res = res as AxiosResponse;
      const _data = _res?.data;
      if (!disableStateUpdate) {
        updateGlobalState({ data: _data });
        setData(_data);
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
        updateGlobalState({ errorData: _error.response });
        setErrorData(_error.response);
      } else if (_error.request) {
        pushToDebug(
          "[FETCHING RESOURCE] REQUEST ERROR RECEIVED",
          _error.request
        );
        updateGlobalState({ errorData: _error.request });
        setErrorData(_error.request);
      } else {
        pushToDebug("[FETCHING RESOURCE] SYSTEM ERROR RECEIVED", error);
        updateGlobalState({ errorData: _error });
        setErrorData(_error);
      }
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

  // Run this useEffect when the hook is mounted or if the deps changes.
  useEffect(() => {
    const callback = () => {
      pushToDebug("INITIALIZING");
      if (isMountTriggerable) {
        pushToDebug("ON MOUNT TRIGGERING");
        refetch();
      } else {
        pushToDebug("SKIPPING ON MOUNT TRIGGER");
      }
    };
    callback();
  }, [isMountTriggerable, pushToDebug, refetch, triggerDepString]);

  const cancel = useCallback(() => {
    controllerInstance.current.abort();
  }, []);

  useEffect(() => {
    updateGlobalState({ refetch, debug, cancel });
  }, [refetch, debug, cancel, updateGlobalState]);

  const Container = containerFactory({
    globalLoadingComponent,
    globalFetchingComponent,
    globalErrorComponent,
    errorData,
    resourceName,
    isLoading,
    isFetching,
    data
  });

  const returnObject = {
    data,
    isLoading,
    isFetching,
    errorData,
    refetch,
    debug,
    cancel,
    Container
  };
  return returnObject;
}
