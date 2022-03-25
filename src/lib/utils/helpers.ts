import { MutableRefObject, useEffect, useRef } from "react";
import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import type {
  MessageQueueInfoType,
  TransformConfigType,
  TransformFailureType,
  TransformSuccessType
} from "../types/helpers.type";

import type {
  OnSuccessType,
  BeforeEventType,
  EventType,
  OnFailureType,
  OnFinishType,
  BaseConfigType,
  PushToAccumulatorType,
  ErrorDataType
} from "../types/main.type";
import type {
  Internal_ChainedRequestConfigType,
  ChainedRequestConfigType
} from "../types/useResource.type";

export const getTriggerDependencies = (
  triggerOn: string | boolean | any[] = "onMount",
  axiosConfig: AxiosRequestConfig = {}
): [any[], boolean] => {
  // Highest priority is if the triggerOn is an array
  if (Array.isArray(triggerOn)) {
    return [triggerOn, true];
  }
  // Second priority is if the triggerOn is a boolean
  if (typeof triggerOn === "boolean") {
    return [[], triggerOn];
  }
  // Third priority is if the triggerOn is a string
  if (triggerOn === "onMount") {
    return [[], true];
  }
  // Fourth priority is when request is a GET request
  const method = (axiosConfig.method || "GET").toUpperCase();
  if (["GET"].includes(method)) {
    return [[], true];
  }
  // By default, on mount trigger is false
  return [[], false];
};

export const getMessageQueueData = (
  data: boolean | object = false,
  fallbackQueueName = ""
): MessageQueueInfoType => {
  if (typeof data === "object") {
    const isAvailable = true;
    // @ts-ignore
    const _keyName: string = (data && data.keyName) || fallbackQueueName;
    return [isAvailable, _keyName];
  }
  const isAvailable = data;
  return [isAvailable, fallbackQueueName];
};

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

/**
 * Deprecated
 */
// export const getErrorMessage = (errorData: ErrorDataType): string => {
//   const defaultErrorMessage = "Something went wrong. Please try again.";
//   // @ts-ignore
//   const err: AxiosError = errorData;
//   if (err?.response?.data?.message) {
//     return err.response.data.message || defaultErrorMessage;
//   }
//   if (err?.message) {
//     return err.message || defaultErrorMessage;
//   }
//   return "";
// };

export const getFunc = (
  requestObject: ChainedRequestConfigType,
  key: string
) => {
  const func =
    // @ts-ignore
    requestObject && typeof requestObject[key] === "function"
      ? // @ts-ignore
        requestObject[key]
      : () => {};
  return func;
};

export const pushToAcc: PushToAccumulatorType = (next, res) => {
  if (next && typeof next === "function") {
    if (res) {
      next(res);
    }
  }
};

export const getFinalRequestChain = (
  newChainedRequestData: ChainedRequestConfigType,
  index: number,
  fullBaseConfigList: ChainedRequestConfigType[],
  internal_beforeEvent: BeforeEventType,
  internal_event: EventType,
  internal_onSuccess: OnSuccessType,
  internal_onFailure: OnFailureType,
  internal_onFinish: OnFinishType,
  controllerInstance: MutableRefObject<AbortController> | undefined = undefined
): Internal_ChainedRequestConfigType => {
  const oldChainedRequestData = fullBaseConfigList[index];
  const finalConfig = {
    ...oldChainedRequestData["baseConfig"],
    ...newChainedRequestData["baseConfig"]
  };
  // The new beforeEvent will overwrite the old beforeEvent
  const _beforeEvent: BeforeEventType = (
    acc,
    next,
    disableStateUpdate = false
  ) => {
    const func: BeforeEventType = getFunc(newChainedRequestData, "beforeEvent");
    func(acc, next);
    internal_beforeEvent(acc, next, disableStateUpdate);
  };

  // The new event will overwrite all the event
  const _event: EventType = async (customConfig, acc, next) => {
    const func: TransformConfigType = getFunc(
      newChainedRequestData,
      "transformConfig"
    );
    const config = {
      signal: controllerInstance?.current?.signal,
      ...finalConfig,
      ...customConfig
    };
    const newConfig: AxiosRequestConfig = func(config, acc, next) || config;
    const res = await internal_event(newConfig, acc, next);
    return res;
  };

  // Runs the request through the user callback then the response is sent to the actual success event
  const _onSuccess: OnSuccessType = (
    res,
    acc,
    next,
    disableStateUpdate = false
  ) => {
    const func: TransformSuccessType = getFunc(
      newChainedRequestData,
      "transformSuccess"
    );
    const res2: any = func(res, acc, next) || res;
    internal_onSuccess(res2, acc, next, disableStateUpdate);
  };

  const _onFailure: OnFailureType = (error, acc, next) => {
    const func: TransformFailureType = getFunc(
      newChainedRequestData,
      "transformFailure"
    );
    const res = func(error, acc, next) || error;
    internal_onFailure(res, acc, next);
  };

  const _onFinish: OnFinishType = (acc, next, disableStateUpdate = false) => {
    const func: OnFinishType = getFunc(newChainedRequestData, "onFinish");
    func(acc, next);
    internal_onFinish(acc, next, disableStateUpdate);
  };

  return {
    baseConfig: finalConfig,
    beforeEvent: _beforeEvent,
    event: _event,
    onSuccess: _onSuccess,
    onFailure: _onFailure,
    onFinish: _onFinish
  };
};

export function compareObject(oldObject: any, newObject: any) {
  return oldObject === newObject;
}

export function useIsMounted(unMountCallback = () => {}) {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      unMountCallback && unMountCallback();
    };
  }, []);

  return isMounted;
}
