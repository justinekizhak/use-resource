import { MutableRefObject, useEffect, useRef } from "react";
import { AxiosRequestConfig } from "axios";
import type {
  MessageQueueInfo_T,
  TransformConfig_T,
  TransformFailure_T,
  TransformSuccess_T
} from "../types/helpers.type";

import type {
  OnSuccess_T,
  BeforeEvent_T,
  Event_T,
  OnFailure_T,
  OnFinish_T,
  BaseConfig_T,
  PushToAccumulator_T
} from "../types/main.type";
import type {
  Internal_ChainedRequestConfig_T,
  ChainedRequestConfig_T
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
): MessageQueueInfo_T => {
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
  baseConfig: BaseConfig_T,
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

export const getFunc = (requestObject: ChainedRequestConfig_T, key: string) => {
  const func =
    // @ts-ignore
    requestObject && typeof requestObject[key] === "function"
      ? // @ts-ignore
        requestObject[key]
      : () => {};
  return func;
};

export const pushToAcc: PushToAccumulator_T = (next, res) => {
  if (next && typeof next === "function") {
    if (res) {
      next(res);
    }
  }
};

export const getFinalRequestChain = (
  newChainedRequestData: ChainedRequestConfig_T,
  index: number,
  fullBaseConfigList: ChainedRequestConfig_T[],
  internal_beforeEvent: BeforeEvent_T,
  internal_event: Event_T,
  internal_onSuccess: OnSuccess_T,
  internal_onFailure: OnFailure_T,
  internal_onFinish: OnFinish_T,
  controllerInstance:
    | MutableRefObject<AbortController | undefined>
    | undefined = undefined
): Internal_ChainedRequestConfig_T => {
  const oldChainedRequestData = fullBaseConfigList[index];
  const finalConfig = {
    ...oldChainedRequestData["baseConfig"],
    ...newChainedRequestData["baseConfig"]
  };
  // The new beforeEvent will overwrite the old beforeEvent
  const _beforeEvent: BeforeEvent_T = (
    acc,
    next,
    disableStateUpdate = false
  ) => {
    const func: BeforeEvent_T = getFunc(newChainedRequestData, "beforeEvent");
    func(acc, next);
    internal_beforeEvent(acc, next, disableStateUpdate);
  };

  // The new event will overwrite all the event
  const _event: Event_T = async (customConfig, acc, next) => {
    const func: TransformConfig_T = getFunc(
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
  const _onSuccess: OnSuccess_T = (
    res,
    acc,
    next,
    disableStateUpdate = false
  ) => {
    const func: TransformSuccess_T = getFunc(
      newChainedRequestData,
      "transformSuccess"
    );
    const res2: any = func(res, acc, next) || res;
    internal_onSuccess(res2, acc, next, disableStateUpdate);
  };

  const _onFailure: OnFailure_T = (error, acc, next) => {
    const func: TransformFailure_T = getFunc(
      newChainedRequestData,
      "transformFailure"
    );
    const res = func(error, acc, next) || error;
    internal_onFailure(res, acc, next);
  };

  const _onFinish: OnFinish_T = (acc, next, disableStateUpdate = false) => {
    const func: OnFinish_T = getFunc(newChainedRequestData, "onFinish");
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
      if (unMountCallback && typeof unMountCallback === "function") {
        unMountCallback();
      }
    };
    // Need to check the dependency array. For some reason is the unMountCallback is added the functionality breaks.
    // It breaks the updatation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isMounted;
}
