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
  BaseConfigType,
  AccumulatorContainer
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

const defaultNext: NextType = (data) => {
  return { current: [data] };
};

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

const getFunc = (requestObject: ChainedRequestConfigType, key: string) => {
  const func =
    // @ts-ignore
    requestObject && typeof requestObject[key] === "function"
      ? // @ts-ignore
        requestObject[key]
      : () => {};
  return func;
};

const getFinalRequestChain = (
  newChainedRequestData: ChainedRequestConfigType,
  index: number,
  fullBaseConfigList: ChainedRequestConfigType[],
  beforeTask: BeforeTaskType,
  task: TaskType,
  onSuccess: OnSuccessType,
  onFailure: OnFailureType,
  onFinal: OnFinalType,
  controllerInstance:
    | React.MutableRefObject<AbortController>
    | undefined = undefined
): ChainedRequestConfigType => {
  const oldChainedRequestData = fullBaseConfigList[index];
  const finalConfig = {
    ...oldChainedRequestData["baseConfig"],
    ...newChainedRequestData["baseConfig"]
  };
  // The new beforeTask will overwrite the old beforeTask
  const finalBeforeTask: BeforeTaskType = (acc, next) => {
    const func = getFunc(newChainedRequestData, "beforeTask");
    const res = func(acc, next);
    const newAcc = (typeof next === "function" && next(res)) || acc;
    const res2 = beforeTask(newAcc, next);
    return res2;
  };

  // The new task will overwrite all the task
  const finalTask: TaskType = async (customConfig, acc, next) => {
    const func = getFunc(newChainedRequestData, "task");
    const config1 = {
      signal: controllerInstance?.current?.signal,
      ...finalConfig,
      ...customConfig
    };
    const res: AxiosRequestConfig = (await func(config1, acc, next)) || config1;
    const res2 = await task(res, acc, next);
    return res2;
  };

  // Runs the request through the user callback then the response is sent to the actual success task
  const finalOnSuccess: OnSuccessType = (res, acc, next) => {
    const func = getFunc(newChainedRequestData, "onSuccess");
    const newRes = func(res, acc, next) || res;
    const res2 = onSuccess(newRes, acc, next);
    return res2;
  };

  const finalOnFailure: OnFailureType = (error, acc, next) => {
    const func = getFunc(newChainedRequestData, "onFailure");
    const newRes = func(error, acc, next) || error;
    const res2 = onFailure(newRes, acc, next);
    return res2;
  };

  const finalOnFinal: OnFinalType = (acc, next) => {
    const func = getFunc(newChainedRequestData, "onFinal");
    const newRes = func(acc, next) || acc;
    const res2 = onFinal(newRes, next);
    return res2;
  };

  return {
    baseConfig: finalConfig,
    beforeTask: finalBeforeTask,
    task: finalTask,
    onSuccess: finalOnSuccess,
    onFailure: finalOnFailure,
    onFinal: finalOnFinal
  };
};

const defaultAccumulator = { current: [] };

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
 */
export const useResource: UseResourceType = (
  baseConfig: BaseConfigType,
  resourceName: string = "resource",
  options: UseResourceOptionsType = {}
) => {
  const {
    CustomContext = null,
    triggerOn = "onMount",
    onMountCallback = (customAxios: AxiosInstance) => {},
    globalLoadingComponent = defaultLoadingComponent,
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

  const { dispatch } = useContext(GlobalResourceContext);

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
      setDebug((oldData) => [...oldData, fullData]);
    },
    [devMode]
  );

  const beforeTask: BeforeTaskType = useCallback(() => {
    pushToDebug("[FETCHING RESOURCE] BEFORE TASK");
    setIsLoading(true);
    setData({});
    setErrorData(undefined);
  }, [pushToDebug]);

  const task: TaskType = useCallback(
    async (customConfig, acc = { current: [] }, next = defaultNext) => {
      const axiosConfig = {
        signal: controllerInstance.current.signal,
        ...defaultConfigRef.current,
        ...customConfig
      };
      pushToDebug("[FETCHING RESOURCE] TASK TRIGGERED", axiosConfig);
      const res = await axiosInstance.current(axiosConfig);
      return res;
    },
    [pushToDebug]
  );

  const onSuccess: OnSuccessType = useCallback(
    (res, acc = defaultAccumulator, next = defaultNext) => {
      const _res = res as AxiosResponse;
      const _data = _res?.data;
      setData(_data);
      pushToDebug("[FETCHING RESOURCE] TASK SUCCESS", _data);
    },
    [pushToDebug]
  );

  const onFailure: OnFailureType = useCallback(
    (error, acc = defaultAccumulator, next = defaultNext) => {
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

  const onFinal: OnFinalType = useCallback(
    (acc, next) => {
      pushToDebug("[FETCHING RESOURCE] TASK END", acc);
      setIsLoading(false);
    },
    [pushToDebug]
  );

  const pushToMessageQueue = useCallback(
    (data) => {
      pushToDebug("PUSHING TO MESSAGE QUEUE: ", data);
    },
    [pushToDebug]
  );

  const refetch = useCallback(
    (customConfig: BaseConfigType = {}) => {
      const taskMaster = async (
        index = 0,
        acc: AccumulatorContainer = { current: [] },
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
            next(res);
            _onSuccess(res, acc, next);
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
          await fullTask();
        }
      };
      if (!useRequestChaining) {
        taskMaster();
      } else {
        const main = async () => {
          const acc: AccumulatorContainer = { current: [] };
          const next: NextType = (data: any) => {
            if (data) {
              acc.current.push(data);
            }
            return acc;
          };
          const baseConfigList = baseConfigRef.current as ChainedRequestConfigType[];
          for (let index = 0; index < baseConfigList.length; index++) {
            const requestChain = baseConfigList[index];
            const {
              baseConfig: _final_baseConfig,
              beforeTask: _final_beforeTask,
              task: _final_task,
              onSuccess: _final_onSuccess,
              onFailure: _final_onFailure,
              onFinal: _final_onFinal
            } = getFinalRequestChain(
              requestChain,
              index,
              baseConfigList,
              beforeTask,
              task,
              onSuccess,
              onFailure,
              onFinal,
              controllerInstance
            );
            await taskMaster(
              index,
              acc,
              next,
              _final_baseConfig,
              _final_beforeTask,
              _final_task,
              _final_onSuccess,
              _final_onFailure,
              _final_onFinal
            );
          }
        };
        main();
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
      useRequestChaining
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

  // Resource object for pushing into GlobalResourceContext
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
  }, [data, debug, errorData, isLoading, refetch, resourceName]);

  // Use effect which runs to update the global context
  useEffect(() => {
    if (useGlobalContext) {
      console.log("dispatching");
      dispatch(contextResource);
    }
  }, [useGlobalContext, contextResource, dispatch]);

  const Container = ({
    children,
    loadingComponent = globalLoadingComponent,
    errorComponent = globalErrorComponent
  }: ContextContainerPropsType) => {
    const errorMessage = getErrorMessage(errorData);

    const useLocalContext =
      CustomContext !== null && CustomContext !== undefined;

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
