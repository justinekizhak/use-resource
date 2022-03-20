import { useCallback, useContext, useRef, useState } from "react";
import { compareObject } from "../utils/helpers";

import type { ResourceKeyType, ValueOf_ResourceType } from "../types/main.type";
import type {
  DispatchType,
  SelectorCallbackType
} from "../types/resourceContext/provider.type";

import { GlobalResourceContext } from "./context";
import type { PublishCallbackType } from "../types/resourceContext/eventQueue.type";

export function useDispatch<T>(
  customContext = GlobalResourceContext
): DispatchType<T> {
  const { state, stateCallbacks } = useContext(customContext);
  const returnCallback: DispatchType<T> = useCallback(
    (key, data) => {
      if (!key || !data) {
        return;
      }
      const oldData = state.current[key];
      const newData = { ...oldData, ...data };
      state.current[key] = newData;
      const allAffectedCallbacks = stateCallbacks.current[key];
      allAffectedCallbacks?.forEach((callback) => {
        callback(newData);
      });
    },
    [state, stateCallbacks]
  );
  return returnCallback;
}

export function useSelector<T>(
  resourceName: string,
  dataKey: ResourceKeyType<T>,
  customContext = GlobalResourceContext
): undefined | ValueOf_ResourceType<T> {
  const [_, setCounter] = useState(0);
  const localValueRef = useRef();
  const { state, stateCallbacks } = useContext(customContext);
  if (!resourceName) {
    return;
  }
  const forceRefresh = () => {
    setCounter((oldValue) => oldValue + 1);
  };
  const existingCallbacks = stateCallbacks.current[resourceName];
  if (!existingCallbacks) {
    stateCallbacks.current[resourceName] = [];
  }
  const resource = state.current[resourceName];
  const callback: SelectorCallbackType<T> = (_data = resource) => {
    const value = dataKey ? _data[dataKey] : _data;
    if (compareObject(localValueRef.current, value)) {
      // The value is the same, no need to update
      return;
    }
    localValueRef.current = value;
    forceRefresh();
  };
  stateCallbacks.current[resourceName].push(callback);
  return localValueRef.current;
}

export function usePublish(customContext = GlobalResourceContext) {
  const { eventQueue } = useContext(customContext);
  const callback: PublishCallbackType = useCallback(
    (event) => {
      eventQueue.current.push(event);
    },
    [eventQueue]
  );
  return callback;
}
