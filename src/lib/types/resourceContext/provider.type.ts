import { ResourceContextState, ResourceContextType } from "./context.type";

export type DispatchCallbackType = (state: ResourceContextState) => any;

export type GlobalResourceContextType = {
  dispatch: (data: ResourceContextType) => void;
  selector: (data: any) => any;
};
