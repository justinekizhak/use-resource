import { AxiosRequestConfig } from "axios";
import { AccumulatorContainer, NextType } from "./main.type";

export type MessageQueueInfoType = [boolean, string];

export type TransformInputType = (
  config: AxiosRequestConfig,
  acc: AccumulatorContainer | undefined,
  next: NextType | undefined
) => AxiosRequestConfig;
