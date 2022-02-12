import type { ResourceType } from "../main.type";

export type DispatchType<T> = (
  key: string,
  stateSlice: ResourceType<T>
) => void;

export type SelectorCallbackType<T> = (
  stateSlice: ResourceType<T>
) => ResourceType<T>;

export type SelectorType<T> = (
  key: string,
  callback: SelectorCallbackType<T>
) => ResourceType<T> | undefined;

export type GlobalResourceContextType<T> = {
  dispatch: DispatchType<T>;
  selector: SelectorType<T>;
};

export type ContextCallbackState = {
  [key: string]: SelectorCallbackType<any>[];
};
