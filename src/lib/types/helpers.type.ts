import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import type { AccumulatorContainer, NextCallback_T } from "./main.type";

export type MessageQueueInfo_T = [boolean, string];

export type TransformConfig_T = (
  config: AxiosRequestConfig,
  acc: AccumulatorContainer | undefined,
  next: NextCallback_T | undefined
) => AxiosRequestConfig | undefined | void;

export type TransformSuccess_T = (
  res: AxiosResponse,
  acc: AccumulatorContainer | undefined,
  next: NextCallback_T | undefined
) => AxiosResponse | object | undefined | void;

export type TransformFailure_T = (
  error: AxiosError,
  acc: AccumulatorContainer | undefined,
  next: NextCallback_T | undefined
) => AxiosError | object | undefined | void;
