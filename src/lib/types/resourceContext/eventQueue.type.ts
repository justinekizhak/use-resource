import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import type {
  AccumulatorType,
  BeforeEventType,
  EventType,
  FullTaskType,
  NextCallbackType,
  OnFailureType,
  OnFinishType,
  OnSuccessType
} from "../main.type";

export type EventQueue_AccumulatorContainer = Array<{
  current: AccumulatorType;
}>;
export type EventQueue_NextCallbackType = (index: number) => NextCallbackType;

export type EventQueue_BeforeEventType = (
  accumulator?: EventQueue_AccumulatorContainer,
  next?: EventQueue_NextCallbackType,
  disableStateUpdate?: boolean
) => void;

export type EventQueue_OnSuccessType = (
  response: AxiosResponse,
  accumulator?: EventQueue_AccumulatorContainer,
  next?: EventQueue_NextCallbackType,
  disableStateUpdate?: boolean
) => void;

export type EventQueue_OnFailureType = (
  error: any | AxiosError,
  accumulator?: EventQueue_AccumulatorContainer,
  next?: EventQueue_NextCallbackType
) => void;

export type EventQueue_OnFinishType = (
  accumulator?: EventQueue_AccumulatorContainer,
  next?: EventQueue_NextCallbackType,
  disableStateUpdate?: boolean
) => void;

export type EventQueue_DataType = {
  resourceName: string;
  beforeEvent: BeforeEventType;
  event: EventType;
  onSuccess: OnSuccessType;
  onFailure: OnFailureType;
  onFinish: OnFinishType;
  fullTask: FullTaskType;
  baseConfig?: AxiosRequestConfig;
};

export type PublishCallbackType = (event: EventQueue_DataType) => void;
export type EventQueueType = React.MutableRefObject<EventQueue_DataType[]>;
