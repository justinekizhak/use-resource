import React from "react";
import type { ResourceType, ResourceKeyType } from "../main.type";
import { ResourceContextState } from "./context.type";

export type DispatchType<T> = (
  key: string,
  stateSlice: ResourceType<T>
) => void;

export type DispatchHookType<T> = (customContext?: React.Context<any>) => T;

export type SelectorCallbackType<T> = (resourceData: ResourceType<T>) => void;

// type ReactStateSetter<S> = React.Dispatch<React.SetStateAction<S>>;

export type SelectorType<T> = (
  resourceName: string,
  dataKeyOrCallback: ResourceKeyType
) => void;

export type GlobalResourceContextType<T> = {
  // dispatch: DispatchType<T>;
  // selector: SelectorType<T>;
  state: React.MutableRefObject<ResourceContextState<T>>;
  stateCallbacks: React.MutableRefObject<ContextCallbackState>;
};

export type ContextCallbackState = {
  [key: string]: SelectorCallbackType<any>[];
};
