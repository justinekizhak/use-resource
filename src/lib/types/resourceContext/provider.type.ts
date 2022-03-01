import React from "react";
import type { ResourceType, ResourceKeyType } from "../main.type";

export type DispatchType<T> = (
  key: string,
  stateSlice: ResourceType<T>
) => void;

export type SelectorCallbackType<T> = (resourceData: ResourceType<T>) => void;

type ReactStateSetter<S> = React.Dispatch<React.SetStateAction<S>>;

export type SelectorType<T> = (
  resourceName: string,
  dataKeyOrCallback: ResourceKeyType | SelectorCallbackType<T>,
  stateSetter?: ReactStateSetter<T>,
  cachedData?: any
) => void;

export type GlobalResourceContextType<T> = {
  dispatch: DispatchType<T>;
  selector: SelectorType<T>;
};

export type ContextCallbackState = {
  [key: string]: SelectorCallbackType<any>[];
};
