import React from "react";
import type { ResourceType, ResourceKeyType } from "../main.type";
import { ResourceContextState } from "../resourceContext/context.type";
import { EventQueueType } from "./eventQueue.type";

export type Dispatch_StateMutationFunction_Type<T> = (
  state: ResourceType<T>
) => ResourceType<T> | void;

export type DispatchType<T> = (
  key: string,
  stateSlice: ResourceType<T> | Dispatch_StateMutationFunction_Type<T>
) => void;

export type DispatchHookType<T> = (customContext?: React.Context<any>) => T;

export type SelectorCallbackType<T> = (resourceData: ResourceType<T>) => void;

export type SelectorType = (
  resourceName: string,
  dataKeyOrCallback: ResourceKeyType
) => void;

export type GlobalResourceContextType<T> = {
  state: React.MutableRefObject<ResourceContextState<T>>;
  stateCallbacks: React.MutableRefObject<ContextCallbackState>;
  eventQueue: EventQueueType;
};

export type ContextCallbackState = {
  [key: string]: SelectorCallbackType<any>[];
};
