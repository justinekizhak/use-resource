import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  useMemo
} from "react";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance
} from "axios";

import {
  UseResourceOptionsType,
  ResourceType,
  DebugObject,
  UseResourceAdvancedOptionsType,
  ErrorComponentType,
  LoadingComponentType,
  UseResourceType,
  ContextContainerPropsType,
  OnSuccessType,
  BeforeTaskType,
  TaskType,
  OnFailureType,
  OnFinalType,
  NextType,
  ChainedRequestConfigType,
  AccumulatorType,
  BaseConfigType
} from "./interfaces";
import { GlobalResourceContext } from "./resourceContext";

const getTriggerDependencies = (
  triggerOn: string | boolean | any[] = "onMount",
  axiosConfig: AxiosRequestConfig = {}
): [any[], boolean] => {
  // Highest priority is if the triggerOn is an array
  if (Array.isArray(triggerOn)) {
    return [triggerOn, true];
  }
  // Second priority is if the triggerOn is a boolean
  if (triggerOn === false) {
    return [[], false];
  }
  if (triggerOn === true) {
    return [[], true];
  }
  // Third priority is if the triggerOn is a string
  if (triggerOn === "onMount") {
    return [[], true];
  }
  // Fourth priority is when request is a GET request
  if (axiosConfig.method === "get") {
    return [[], false];
  }
  // By default, on mount trigger is false
  return [[], false];
};

const getMessageQueueData = (data: boolean | object = false) => {
  return [false, ""];
  // if (typeof data === "object") {
  //   const isAvailable = true;
  //   const keyName = data?.keyName || "";
  //   return [isAvailable, keyName];
  // }
  // const isAvailable = data;
  // const keyName = `${Date.now()}`;
  // return [isAvailable, keyName];
};

export const defaultLoadingComponent: LoadingComponentType = () => (
  <div className="loading"> Loading... </div>
);
export const defaultErrorComponent: ErrorComponentType = (
  errorMessage: string,
  errorData: any
) => <div className="error-message"> {errorMessage} </div>;

export const getBaseConfig = (
  baseConfig: BaseConfigType,
  index = 0
): AxiosRequestConfig => {
  const useRequestChaining = Array.isArray(baseConfig);
  if (useRequestChaining && baseConfig.length === 0) {
    throw new Error("Please pass in the request config");
  }
  const defaultConfig: AxiosRequestConfig = useRequestChaining
    ? baseConfig[index]["baseConfig"]
    : baseConfig;

  return defaultConfig;
};

const defaultNext: NextType = (data) => [data];

const getErrorMessage = (
  errorData: AxiosError | AxiosResponse | undefined
): string => {
  const defaultErrorMessage = "Something went wrong. Please try again.";
  const err = errorData as AxiosError;
  if (err?.response?.data?.message) {
    return err.response.data.message || defaultErrorMessage;
  }
  if (err?.message) {
    return err.message || defaultErrorMessage;
  }
  return "";
};

/**
 * Input parameters:
 * 1. axiosParams,
 * 2. triggerOn: Default value: true
 *      Accepts: boolean: false -> none; true -> onMount
 *              array: array of dependencies
 * 3. use message queue: Default value: false
 *      Accepts: boolean
 *                object
 * 4. onMountHook:
 *      Can be used to inject interceptors
 *
 *
 * Returns:
 * 1. data
 * 2. isLoading
 * 3. errorMessage
 * 4. refetch
 * 5. debug
 * 6. cancel
 * 7. Provider
 */
export const useResource: UseResourceType = (
  baseConfig: BaseConfigType,
  resourceName: string = "resource",
  options: UseResourceOptionsType = {},
  advancedOptions: UseResourceAdvancedOptionsType = {}
) => {
  const {
    CustomContext = null,
    triggerOn = "onMount",
    onMountCallback = (customAxios: AxiosInstance) => {}
  } = options;
  const {
    globalLoadingComponent = defaultLoadingComponent,
    globalErrorComponent = defaultErrorComponent,
    useMessageQueue = false
  } = advancedOptions;

  const useRequestChaining = Array.isArray(baseConfig);
  if (useRequestChaining && baseConfig.length === 0) {
    throw new Error("Please pass in the request config");
  }
  const defaultConfig = getBaseConfig(baseConfig);

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorData, setErrorData] = useState<AxiosError | AxiosResponse>();
  const [debug, setDebug] = useState<DebugObject[]>([]);
  const axiosInstance = useRef<AxiosInstance>(axios);
  const controllerInstance = useRef<AbortController>(new AbortController());
  const defaultConfigRef = useRef<AxiosRequestConfig>(defaultConfig);
  const baseConfigRef = useRef(baseConfig);

  const [triggerDeps, isMountTriggerable] = getTriggerDependencies(
    triggerOn,
    defaultConfigRef.current
  );

  const [isMessageQueueAvailable, messageQueueName] = getMessageQueueData(
    useMessageQueue
  );

  const pushToDebug = useCallback((message: string = "", data: object = {}) => {
    console.log(message);
    const timestamp = Date.now() + "";
    const fullData = { timestamp, data, message };
    setDebug((oldData) => [...oldData, fullData]);
  }, []);

  const beforeTask: BeforeTaskType = useCallback(() => {
    pushToDebug("[FETCHING RESOURCE] BEFORE TASK");
    setIsLoading(true);
    setData({});
    setErrorData(undefined);
  }, [pushToDebug]);

  const task: TaskType = useCallback(
    async (customConfig, acc = [], next = defaultNext) => {
      const axiosConfig = {
        signal: controllerInstance.current.signal,
        ...defaultConfigRef.current,
        ...customConfig
      };
      pushToDebug("[FETCHING RESOURCE] TASK TRIGGERED", axiosConfig);
      const res = await axiosInstance.current(axiosConfig);
      return next(res);
    },
    [pushToDebug]
  );

  const onSuccess: OnSuccessType = useCallback(
    (res, acc = [], next = defaultNext) => {
      const _res = res as AxiosResponse;
      const _data = _res?.data;
      setData(_data);
      pushToDebug("[FETCHING RESOURCE] TASK SUCCESS", _data);
    },
    [pushToDebug]
  );

  const onFailure: OnFailureType = useCallback(
    (error, acc = [], next = defaultNext) => {
      if (!error) {
        return;
      }
      const _error: AxiosError = error;
      if (_error.response) {
        pushToDebug(
          "[FETCHING RESOURCE] RESPONSE ERROR RECEIVED",
          _error.response
        );
        setErrorData(_error.response);
      } else if (_error.request) {
        pushToDebug(
          "[FETCHING RESOURCE] REQUEST ERROR RECEIVED",
          _error.request
        );
        setErrorData(_error.request);
      } else {
        pushToDebug("[FETCHING RESOURCE] SYSTEM ERROR RECEIVED", error);
        setErrorData(_error);
      }
    },
    [pushToDebug]
  );

  const onFinal: OnFinalType = useCallback(() => {
    pushToDebug("[FETCHING RESOURCE] TASK END");
    setIsLoading(false);
  }, [pushToDebug]);

  const pushToMessageQueue = useCallback(
    (data) => {
      pushToDebug("PUSHING TO MESSAGE QUEUE: ", data);
    },
    [pushToDebug]
  );

  const refetch = useCallback(
    (customConfig: BaseConfigType = {}) => {
      const taskMaster = (
        index = 0,
        acc: AccumulatorType = [],
        next: NextType = defaultNext,
        _baseConfig = getBaseConfig(customConfig, index),
        _beforeTask = beforeTask,
        _task = task,
        _onSuccess = onSuccess,
        _onFailure = onFailure,
        _onFinal = onFinal
      ) => {
        const fullTask = async () => {
          try {
            _beforeTask(acc, next);
            const res = await _task(_baseConfig, acc, next);
            _onSuccess(res[index], acc, next);
          } catch (error) {
            _onFailure(error, acc, next);
          } finally {
            _onFinal(acc, next);
          }
        };
        if (isMessageQueueAvailable) {
          pushToMessageQueue({
            key: messageQueueName,
            beforeTask: _beforeTask,
            task: _task,
            onSuccess: _onSuccess,
            onFailure: _onFailure,
            onFinal: _onFinal,
            fullTask
          });
        } else {
          fullTask();
        }
      };
      if (!useRequestChaining) {
        taskMaster();
      } else {
        pushToDebug("REQUEST CHAIN");
        const acc: AccumulatorType = [];
        const next: NextType = (data) => [...acc, data];
        const baseConfigList = baseConfigRef.current as ChainedRequestConfigType[];
        baseConfigList.forEach((requestChain, index) => {
          const {
            baseConfig,
            beforeTask,
            task,
            onSuccess,
            onFailure,
            onFinal
          } = requestChain;
          taskMaster(
            index,
            acc,
            next,
            baseConfig,
            beforeTask,
            task,
            onSuccess,
            onFailure,
            onFinal
          );
        });
      }
    },
    [
      beforeTask,
      task,
      onSuccess,
      onFailure,
      onFinal,
      isMessageQueueAvailable,
      pushToMessageQueue,
      messageQueueName,
      useRequestChaining,
      pushToDebug
    ]
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

  const cancel = () => {
    controllerInstance.current.abort();
  };

  const Container = ({
    children,
    loadingComponent = globalLoadingComponent,
    errorComponent = globalErrorComponent
  }: ContextContainerPropsType) => {
    const { dispatch } = useContext(GlobalResourceContext);

    const errorMessage = getErrorMessage(errorData);

    const contextResource = useMemo(() => {
      const resourceData: ResourceType = {
        data,
        isLoading,
        errorData,
        refetch,
        debug,
        cancel
      };
      return { [resourceName]: resourceData };
    }, []);

    const useGlobalContext = CustomContext === "global";
    const useLocalContext =
      CustomContext !== "global" &&
      CustomContext !== null &&
      CustomContext !== undefined;

    useEffect(() => {
      if (useGlobalContext) {
        dispatch(contextResource);
      }
    }, [useGlobalContext, contextResource, dispatch]);

    const content = () => (
      <div className="content">
        {isLoading ? (
          loadingComponent()
        ) : errorMessage ? (
          errorComponent(errorMessage, errorData)
        ) : (
          <div className="content">{children}</div>
        )}
      </div>
    );

    return (
      <div className={`resource-${resourceName}`}>
        {useLocalContext ? (
          <CustomContext.Provider value={contextResource}>
            <div className="local-context">{content()}</div>
          </CustomContext.Provider>
        ) : (
          content()
        )}
      </div>
    );
  };

  return {
    data,
    isLoading,
    errorData,
    refetch,
    debug,
    cancel,
    Container
  };
};
