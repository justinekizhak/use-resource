import { AxiosRequestConfig } from "axios";
import { MutableRefObject } from "react";
import type {
  AccumulatorContainer,
  BaseConfigType,
  BeforeEventType,
  NextCallbackType,
  OnFailureType,
  OnFinishType,
  OnSuccessType,
  EventType
} from "./main.type";

export interface RefetchFunctionArgType {
  accumulator: AccumulatorContainer;
  defaultNext: NextCallbackType;
  beforeEvent: BeforeEventType;
  event: EventType;
  onSuccess: OnSuccessType;
  onFailure: OnFailureType;
  onFinish: OnFinishType;
  isMessageQueueAvailable: boolean;
  pushToMessageQueue: (data: any) => void;
  useRequestChaining: boolean;
  baseConfigRef: MutableRefObject<BaseConfigType>;
  controllerInstance: MutableRefObject<AbortController | undefined>;
  resourceName: string;
}

export type RefetchFunctionType = (
  args: RefetchFunctionArgType
) => (customConfig?: BaseConfigType) => void;

export type EventMasterFuncType = (
  index?: number,
  em_acc?: AccumulatorContainer,
  em_next?: NextCallbackType,
  em_baseConfig?: AxiosRequestConfig,
  em_beforeEvent?: BeforeEventType,
  em_event?: EventType,
  em_onSuccess?: OnSuccessType,
  em_onFailure?: OnFailureType,
  em_onFinish?: OnFinishType,
  totalTask?: number
) => Promise<void>;

export interface RequestChainHanderArgType {
  baseConfigRef: MutableRefObject<BaseConfigType>;
  internal_beforeEvent: BeforeEventType;
  internal_event: EventType;
  internal_onSuccess: OnSuccessType;
  internal_onFailure: OnFailureType;
  internal_onFinish: OnFinishType;
  controllerInstance: MutableRefObject<AbortController | undefined>;
  eventMaster: EventMasterFuncType;
}

export type RequestChainHandlerType = (
  args: RequestChainHanderArgType
) => () => void;
