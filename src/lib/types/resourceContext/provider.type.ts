import React from "react";
import type {
  ResourceType,
  ResourceKeyType,
  BeforeEventType,
  EventType,
  OnSuccessType,
  OnFailureType,
  OnFinishType,
  FullTaskType
} from "lib/types/main.type";
import { ResourceContextState } from "lib/types/resourceContext/context.type";
import { AxiosRequestConfig } from "axios";

export type DispatchType<T> = (
  key: string,
  stateSlice: ResourceType<T>
) => void;

export type DispatchHookType<T> = (customContext?: React.Context<any>) => T;

export type SelectorCallbackType<T> = (resourceData: ResourceType<T>) => void;

export type SelectorType<T> = (
  resourceName: string,
  dataKeyOrCallback: ResourceKeyType<T>
) => void;

export type GlobalResourceContextType<T> = {
  state: React.MutableRefObject<ResourceContextState<T>>;
  stateCallbacks: React.MutableRefObject<ContextCallbackState>;
  eventQueue: EventQueueType;
};

export type ContextCallbackState = {
  [key: string]: SelectorCallbackType<any>[];
};

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
