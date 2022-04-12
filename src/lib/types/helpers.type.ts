import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import type {
  AccumulatorContainer_T,
  PushToAcc_Meta_T,
  PushToAcc_T
} from "./main.type";

export type MessageQueueInfo_T = [boolean, string];

export type TransformConfig_T = (
  config: AxiosRequestConfig,
  acc: AccumulatorContainer_T | undefined,
  pushToAcc: PushToAcc_T | undefined,
  requestMetadata: PushToAcc_Meta_T
) => AxiosRequestConfig | undefined | void;

export type TransformSuccess_T = (
  res: AxiosResponse,
  acc: AccumulatorContainer_T | undefined,
  pushToAcc: PushToAcc_T | undefined,
  requestMetadata: PushToAcc_Meta_T
) => AxiosResponse | object | undefined | void;

export type TransformFailure_T = (
  error: AxiosError,
  acc: AccumulatorContainer_T | undefined,
  pushToAcc: PushToAcc_T | undefined,
  requestMetadata: PushToAcc_Meta_T
) => AxiosError | object | undefined | void;
