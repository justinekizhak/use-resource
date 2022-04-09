import React from "react";
import type { Resource_T, ResourceKey_T } from "../main.type";
import { ResourceContextState_T } from "../resourceContext/context.type";
import { EventQueue_T } from "./eventQueue.type";

export type Dispatch_StateMutationFunction__T<T> = (
  state: Resource_T<T>
) => Resource_T<T> | void;

export type Dispatch_T<T> = (
  key: string,
  stateSlice: Resource_T<T> | Dispatch_StateMutationFunction__T<T>
) => void;

export type DispatchHook_T<T> = (customContext?: React.Context<any>) => T;

export type SelectorCallback_T<T> = (resourceData: Resource_T<T>) => void;

export type Selector_T = (
  resourceName: string,
  dataKeyOrCallback: ResourceKey_T
) => void;

export type GlobalResourceContext_T<T> = {
  state: React.MutableRefObject<ResourceContextState_T<T>>;
  stateCallbacks: React.MutableRefObject<ContextCallbackState>;
  eventQueue: EventQueue_T;
};

export type ContextCallbackState = {
  [key: string]: SelectorCallback_T<any>[];
};
