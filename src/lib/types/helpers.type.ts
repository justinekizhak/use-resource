import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { AccumulatorContainer, NextType } from "./main.type";

export type MessageQueueInfoType = [boolean, string];

export type TransformConfigType = (
  config: AxiosRequestConfig,
  acc: AccumulatorContainer | undefined,
  next: NextType | undefined
) => AxiosRequestConfig | undefined | void;

export type TransformSuccessType = (
  res: AxiosResponse,
  acc: AccumulatorContainer | undefined,
  next: NextType | undefined
) => AxiosResponse | object | undefined | void;

export type TransformFailureType = (
  error: AxiosError,
  acc: AccumulatorContainer | undefined,
  next: NextType | undefined
) => AxiosError | object | undefined | void;
