import { MutableRefObject } from "react";
import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

import {
  OnSuccessType,
  BeforeTaskType,
  TaskType,
  OnFailureType,
  OnFinalType,
  ChainedRequestConfigType,
  BaseConfigType,
  PushToAccumulatorType
} from "./interfaces";

export const getTriggerDependencies = (
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

export const getMessageQueueData = (data: boolean | object = false) => {
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

export const getErrorMessage = (
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
  beforeTask: BeforeTaskType,
  task: TaskType,
  onSuccess: OnSuccessType,
  onFailure: OnFailureType,
  onFinal: OnFinalType,
  controllerInstance: MutableRefObject<AbortController> | undefined = undefined
): ChainedRequestConfigType => {
  const oldChainedRequestData = fullBaseConfigList[index];
  const finalConfig = {
    ...oldChainedRequestData["baseConfig"],
    ...newChainedRequestData["baseConfig"]
  };
  // The new beforeTask will overwrite the old beforeTask
  const finalBeforeTask: BeforeTaskType = (acc, next) => {
    const func: BeforeTaskType = getFunc(newChainedRequestData, "beforeTask");
    const res = func(acc, next);
    pushToAcc(next, res);
    const res2 = beforeTask(acc, next);
    pushToAcc(next, res2);
    return res2;
  };

  // The new task will overwrite all the task
  const finalTask: TaskType = async (customConfig, acc, next) => {
    const func: TaskType = getFunc(newChainedRequestData, "task");
    const config1 = {
      signal: controllerInstance?.current?.signal,
      ...finalConfig,
      ...customConfig
    };
    const res: AxiosRequestConfig = (await func(config1, acc, next)) || config1;
    pushToAcc(next, res);
    const res2 = await task(res, acc, next);
    pushToAcc(next, res2);
    return res2;
  };

  // Runs the request through the user callback then the response is sent to the actual success task
  const finalOnSuccess: OnSuccessType = (
    res,
    acc,
    next,
    disableStateUpdate
  ) => {
    const func: OnSuccessType = getFunc(newChainedRequestData, "onSuccess");
    const res2 = func(res, acc, next, disableStateUpdate) || res;
    pushToAcc(next, res2);
    const res3 = onSuccess(res2, acc, next, disableStateUpdate);
    pushToAcc(next, res3);
    return res3;
  };

  const finalOnFailure: OnFailureType = (error, acc, next) => {
    const func: OnFailureType = getFunc(newChainedRequestData, "onFailure");
    const res = func(error, acc, next) || error;
    pushToAcc(next, res);
    const res2 = onFailure(res, acc, next);
    pushToAcc(next, res2);
    return res2;
  };

  const finalOnFinal: OnFinalType = (acc, next) => {
    const func: OnFinalType = getFunc(newChainedRequestData, "onFinal");
    const res = func(acc, next);
    pushToAcc(next, res);
    const res2 = onFinal(acc, next);
    pushToAcc(next, res2);
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
