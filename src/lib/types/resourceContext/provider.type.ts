import React from "react";
import type { ResourceType, ResourceKeyType } from "lib/types/main.type";
import { ResourceContextState } from "lib/types/resourceContext/context.type";
import { EventQueueType } from "./eventQueue.type";

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
