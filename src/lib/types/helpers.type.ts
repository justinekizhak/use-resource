import { AxiosRequestConfig } from "axios";
import { AccumulatorContainer, NextType } from "./index.type";

export type MessageQueueInfoType = [boolean, string];

export type TransformInputType = (
  config: AxiosRequestConfig,
  acc: AccumulatorContainer | undefined,
  next: NextType | undefined
) => AxiosRequestConfig;
