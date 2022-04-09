import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import type {
  Accumulator_T,
  BeforeEvent_T,
  Event_T,
  FullTask_T,
  NextCallback_T,
  OnFailure_T,
  OnFinish_T,
  OnSuccess_T
} from "../main.type";

export type EventQueue_AccumulatorContainer = Array<{
  current: Accumulator_T;
}>;
export type EventQueue_NextCallback_T = (index: number) => NextCallback_T;

export type EventQueue_BeforeEvent_T = (
  accumulator?: EventQueue_AccumulatorContainer,
  next?: EventQueue_NextCallback_T,
  disableStateUpdate?: boolean
) => void;

export type EventQueue_OnSuccess_T = (
  response: AxiosResponse,
  accumulator?: EventQueue_AccumulatorContainer,
  next?: EventQueue_NextCallback_T,
  disableStateUpdate?: boolean
) => void;

export type EventQueue_OnFailure_T = (
  error: any | AxiosError,
  accumulator?: EventQueue_AccumulatorContainer,
  next?: EventQueue_NextCallback_T
) => void;

export type EventQueue_OnFinish_T = (
  accumulator?: EventQueue_AccumulatorContainer,
  next?: EventQueue_NextCallback_T,
  disableStateUpdate?: boolean
) => void;

export type EventQueue_Data_T = {
  resourceName: string;
  beforeEvent: BeforeEvent_T;
  event: Event_T;
  onSuccess: OnSuccess_T;
  onFailure: OnFailure_T;
  onFinish: OnFinish_T;
  fullTask: FullTask_T;
  baseConfig?: AxiosRequestConfig;
};

export type EventQueue_DeDup_Data_T = {
  resourceName: string;
  beforeEvent: EventQueue_BeforeEvent_T;
  event: Event_T;
  onSuccess: EventQueue_OnSuccess_T;
  onFailure: EventQueue_OnFailure_T;
  onFinish: EventQueue_OnFinish_T;
  fullTask: FullTask_T;
  baseConfig?: AxiosRequestConfig;
};

export type PublishCallback_T = (event: EventQueue_Data_T) => void;
export type EventQueue_T = React.MutableRefObject<EventQueue_Data_T[]>;
