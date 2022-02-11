import {
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
  ResourceType,
  DebugObject,
  ContextContainerPropsType,
  OnSuccessType,
  BeforeTaskType,
  TaskType,
  OnFailureType,
  OnFinalType,
  NextType,
  BaseConfigType,
  AccumulatorType
} from "./types/index.type";
import { GlobalResourceContext } from "./resourceContext/context";
import {
  UseResourceType,
  UseResourceOptionsType
} from "./types/useResource.type";

import {
  defaultLoadingComponent,
  defaultErrorComponent
} from "./utils/defaultComponents";

import {
  getBaseConfig,
  getTriggerDependencies,
  getMessageQueueData,
  getErrorMessage,
  pushToAcc
} from "./utils/helpers";

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

  const [isMessageQueueAvailable, messageQueueName] = getMessageQueueData(
    useMessageQueue
  );

  const defaultNext: NextType = (data) => {
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

  const beforeTask: BeforeTaskType = useCallback(
    (acc = accumulator, next = defaultNext, disableStateUpdate = false) => {
      pushToDebug("[FETCHING RESOURCE] BEFORE TASK");
      if (!disableStateUpdate) {
        setIsLoading(true);
        setData({});
        setErrorData(undefined);
      }
    },
    [pushToDebug]
  );

  const task: TaskType = useCallback(
    async (customConfig, acc = accumulator, next = defaultNext) => {
      const axiosConfig = {
        signal: controllerInstance.current.signal,
        ...defaultConfigRef.current,
        ...customConfig
      };
      pushToDebug("[FETCHING RESOURCE] TASK TRIGGERED", axiosConfig);
      pushToAcc(next, axiosConfig);
      const res = await axiosInstance.current(axiosConfig);
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
        setData(_data);
      }
      pushToAcc(next, _res);
      pushToDebug("[FETCHING RESOURCE] TASK SUCCESS", _res);
    },
    [pushToDebug]
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
    (acc, next, disableStateUpdate = false) => {
      pushToDebug("[FETCHING RESOURCE] TASK END", acc);
      if (!disableStateUpdate) {
        setIsLoading(false);
      }
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
    (customConfig?: BaseConfigType) =>
      refetchFunction({
        accumulator,
        defaultNext,
        beforeTask,
        task,
        onSuccess,
        onFailure,
        onFinal,
        isMessageQueueAvailable,
        messageQueueName,
        pushToMessageQueue,
        useRequestChaining,
        baseConfigRef,
        controllerInstance
      })(customConfig),
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
  }, [data, errorData, isLoading, refetch, resourceName]);

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

  const returnObject = {
    data,
    isLoading,
    errorData,
    refetch,
    debug,
    cancel,
    Container
  };
  // console.log(resourceName, returnObject);
  return returnObject;
};
