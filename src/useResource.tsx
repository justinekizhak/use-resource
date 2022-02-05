import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useRef,
  ReactChild,
  ReactFragment,
  ReactPortal
} from "react";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance
} from "axios";

export const ResourceContext = createContext({});

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
  if (typeof data === "object") {
    const isAvailable = true;
    const keyName = data?.keyName || "";
    return [isAvailable, keyName];
  }
  const isAvailable = data;
  const keyName = `${Date.now()}`;
  return [isAvailable, keyName];
};

interface DebugObject {
  timestamp: string;
  message?: string;
  data?: object;
}

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
export const useResource = (
  defaultConfig: AxiosRequestConfig,
  triggerOn: string | boolean | any[] = "onMount",
  useMessageQueue: boolean | object = false,
  onMountCallback = (customAxios: AxiosInstance) => {},
  resourceName: string = ""
) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorData, setErrorData] = useState<AxiosError>();
  const [debug, setDebug] = useState<DebugObject[]>([]);
  const axiosInstance = useRef<AxiosInstance>(axios);
  const controllerInstance = useRef<AbortController>(new AbortController());
  const defaultConfigRef = useRef<AxiosRequestConfig>(defaultConfig);

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

  const beforeTask = useCallback(() => {
    pushToDebug("[FETCHING RESOURCE] BEFORE TASK");
    setIsLoading(true);
  }, [pushToDebug]);

  const task = useCallback(
    async (customConfig) => {
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

  const onSuccess = useCallback(
    (res: AxiosResponse) => {
      const _data = res?.data;
      setData(_data);
      pushToDebug("[FETCHING RESOURCE] TASK SUCCESS", _data);
    },
    [pushToDebug]
  );

  const onFailure = useCallback(
    (error) => {
      if (error.response) {
        pushToDebug(
          "[FETCHING RESOURCE] RESPONSE ERROR RECEIVED",
          error.response
        );
        setErrorData(error.response);
      } else if (error.request) {
        pushToDebug(
          "[FETCHING RESOURCE] REQUEST ERROR RECEIVED",
          error.request
        );
        setErrorData(error.request);
      } else {
        pushToDebug("[FETCHING RESOURCE] SYSTEM ERROR RECEIVED", error);
        setErrorData(error);
      }
    },
    [pushToDebug]
  );

  const onFinal = useCallback(() => {
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
    (customConfig: AxiosRequestConfig = {}) => {
      const fullTask = async () => {
        try {
          beforeTask();
          const res = await task(customConfig);
          onSuccess(res);
        } catch (error) {
          onFailure(error);
        } finally {
          onFinal();
        }
      };
      if (isMessageQueueAvailable) {
        pushToMessageQueue({
          key: messageQueueName,
          beforeTask,
          task,
          onSuccess,
          onFailure,
          onFinal,
          fullTask
        });
      } else {
        fullTask();
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
      messageQueueName
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
    contextOnly = false
  }: {
    children:
      | boolean
      | ReactChild
      | ReactFragment
      | ReactPortal
      | null
      | undefined;
    contextOnly?: boolean;
  }) => {
    const errorMessage = errorData
      ? errorData?.message || "Something went wrong. Please try again."
      : "";
    return (
      <div className={`resource-${resourceName}`}>
        <ResourceContext.Provider
          value={{ data, isLoading, errorData, refetch }}
        >
          {contextOnly ? (
            <div className="context-only">
              <div className="content">{children}</div>
            </div>
          ) : (
            <div className="context-with-handler">
              {isLoading ? (
                <div className="loading"> Loading... </div>
              ) : errorMessage ? (
                <div className="error-message"> {errorMessage} </div>
              ) : (
                <div className="content">{children}</div>
              )}
            </div>
          )}
        </ResourceContext.Provider>
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
