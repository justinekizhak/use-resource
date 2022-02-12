import { ResourceType } from "../main.type";

export type DispatchType = (key: string, stateSlice: ResourceType) => void;

// interface SelectorCallbackFunc<T> {
//   (stateSlice: T): T
// }

type SelectorCallback = (stateSlice: ResourceType) => ResourceType;

export type SelectorType = (
  key: string,
  callback: SelectorCallback
) => ResourceType | undefined;

export interface GlobalResourceContextType {
  dispatch: DispatchType;
  selector: SelectorType;
}

export type ContextCallbackState = {
  [key: string]: SelectorCallback[];
};
