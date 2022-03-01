import { useRef, useCallback } from "react";
import { compareObject } from "../utils/helpers";

import type {
  Internal_JsxComponentType,
  ResourceKeyType
} from "../types/main.type";
import type {
  ContextCallbackState,
  DispatchType,
  SelectorCallbackType,
  SelectorType
} from "../types/resourceContext/provider.type";
import type { ResourceContextState } from "../types/resourceContext/context.type";

import { GlobalResourceContext } from "./context";

export const GlobalResourceContextProvider = (props: {
  children: Internal_JsxComponentType;
}) => {
  const state = useRef<ResourceContextState<any>>({});
  const stateCallbacks = useRef<ContextCallbackState>({});

  const dispatch: DispatchType<any> = useCallback((key, data) => {
    if (!key || !data) {
      return;
    }
    const updateKey = Object.keys(data)[0] as ResourceKeyType;
    const oldValue = state.current[key]?.[updateKey];
    const newValue = data[updateKey];
    if (compareObject(oldValue, newValue)) {
      return;
    }
    const oldData = state.current[key];
    const newData = { ...oldData, ...data };
    state.current[key] = newData;
    const allAffectedCallbacks = stateCallbacks.current[key];
    allAffectedCallbacks?.forEach((callback) => {
      callback(newData);
    });
  }, []);

  const selector: SelectorType<any> = useCallback(
    (
      resourceName,
      dataKeyOrCallback,
      stateSetter,
      _internalValue = undefined
    ) => {
      if (!resourceName) {
        return;
      }
      const dataKey =
        typeof dataKeyOrCallback === "string" ? dataKeyOrCallback : undefined;
      const customCallback =
        typeof dataKeyOrCallback === "function" ? dataKeyOrCallback : undefined;
      const existingCallbacks = stateCallbacks.current[resourceName];
      if (!existingCallbacks) {
        stateCallbacks.current[resourceName] = [];
      }
      const resource = state.current[resourceName];
      const defaultCallback: SelectorCallbackType<any> = (_data = resource) => {
        if (!dataKey) {
          console.log("Data key is empty");
          return;
        }
        const value = _data[dataKey];
        if (_internalValue && compareObject(_internalValue, value)) {
          return;
        }
        if (stateSetter && typeof stateSetter === "function") {
          stateSetter(value);
        }
      };
      const customCallbackWrapper: SelectorCallbackType<any> = (
        resourceData
      ) => {
        if (customCallback && typeof customCallback === "function") {
          customCallback(resourceData);
        }
      };
      const callback =
        (customCallback && customCallbackWrapper) || defaultCallback;
      stateCallbacks.current[resourceName].push(callback);
    },
    []
  );

  return (
    <GlobalResourceContext.Provider value={{ dispatch, selector }}>
      {props.children}
    </GlobalResourceContext.Provider>
  );
};
