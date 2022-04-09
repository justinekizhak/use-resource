import { AxiosRequestConfig } from "axios";
import { MutableRefObject } from "react";
import type {
  AccumulatorContainer_T,
  BaseConfig_T,
  BeforeEvent_T,
  NextCallback_T,
  OnFailure_T,
  OnFinish_T,
  OnSuccess_T,
  Event_T
} from "./main.type";

export interface RefetchFunctionArg_T {
  accumulator: AccumulatorContainer_T;
  defaultNext: NextCallback_T;
  beforeEvent: BeforeEvent_T;
  event: Event_T;
  onSuccess: OnSuccess_T;
  onFailure: OnFailure_T;
  onFinish: OnFinish_T;
  isMessageQueueAvailable: boolean;
  pushToMessageQueue: (data: any) => void;
  useRequestChaining: boolean;
  baseConfigRef: MutableRefObject<BaseConfig_T>;
  controllerInstance: MutableRefObject<AbortController | undefined>;
  resourceName: string;
}

export type RefetchFunction_T = (
  args: RefetchFunctionArg_T
) => (customConfig?: BaseConfig_T) => void;

export type EventMasterFunc_T = (
  index?: number,
  em_acc?: AccumulatorContainer_T,
  em_next?: NextCallback_T,
  em_baseConfig?: AxiosRequestConfig,
  em_beforeEvent?: BeforeEvent_T,
  em_event?: Event_T,
  em_onSuccess?: OnSuccess_T,
  em_onFailure?: OnFailure_T,
  em_onFinish?: OnFinish_T,
  totalTask?: number
) => Promise<void>;

export interface RequestChainHanderArg_T {
  baseConfigRef: MutableRefObject<BaseConfig_T>;
  internal_beforeEvent: BeforeEvent_T;
  internal_event: Event_T;
  internal_onSuccess: OnSuccess_T;
  internal_onFailure: OnFailure_T;
  internal_onFinish: OnFinish_T;
  controllerInstance: MutableRefObject<AbortController | undefined>;
  eventMaster: EventMasterFunc_T;
}

export type RequestChainHandler_T = (
  args: RequestChainHanderArg_T
) => () => void;
