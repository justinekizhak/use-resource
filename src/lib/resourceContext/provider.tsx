import { useRef, useCallback } from "react";

import type { JsxComponentType, ResourceType } from "../types/main.type";
import type {
  ContextCallbackState,
  DispatchType,
  SelectorType
} from "../types/resourceContext/provider.type";
import type { ResourceContextState } from "../types/resourceContext/context.type";

import { GlobalResourceContext } from "./context";

export const GlobalResourceContextProvider = (props: {
  children: JsxComponentType;
}) => {
  const state = useRef<ResourceContextState<any>>({});
  const stateCallbacks = useRef<ContextCallbackState>({});

  const dispatch: DispatchType<any> = useCallback((key, data) => {
    if (!key || !data) {
      return;
    }
    const oldData = state.current[key];
    const newData = { ...oldData, ...data };
    if (oldData === newData) {
      return;
    }
    state.current[key] = newData;
    const allAffectedCallbacks = stateCallbacks.current[key];
    allAffectedCallbacks.forEach((callback) => {
      callback(data);
    });
  }, []);

  const selector: SelectorType<any> = useCallback((key, callback) => {
    if (!key) {
      return;
    }
    const existingCallbacks = stateCallbacks.current[key];
    if (!existingCallbacks) {
      stateCallbacks.current[key] = [];
    }
    stateCallbacks.current[key].push(callback);
    const stateSlice: ResourceType<any> = state.current[key] || {
      isLoading: false,
      data: {},
      errorData: {}
    };
    return callback(stateSlice);
  }, []);

  return (
    <GlobalResourceContext.Provider value={{ dispatch, selector }}>
      {props.children}
    </GlobalResourceContext.Provider>
  );
};
