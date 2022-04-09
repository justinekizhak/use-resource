import { useCallback, useContext, useRef, useState } from "react";
import { compareObject } from "../utils/helpers";

import type {
  ResourceKey_T,
  Resource_T,
  ValueOf_Resource_T
} from "../types/main.type";
import type {
  Dispatch_T,
  SelectorCallback_T
} from "../types/resourceContext/provider.type";

import { GlobalResourceContext } from "./context";
import type { PublishCallback_T } from "../types/resourceContext/eventQueue.type";

export function useDispatch<T>(
  customContext = GlobalResourceContext
): Dispatch_T<T> {
  const { state, stateCallbacks } = useContext(customContext);
  const returnCallback: Dispatch_T<T> = useCallback(
    (key, data) => {
      if (!key || !data) {
        return;
      }
      const oldData = state.current[key];
      // This will merge the data at the slice level not at the data inside the keys
      // For example: If you pass a single key value pair in the data attribute inside the slice
      // It will overwrite all the other values in the data attribute with the new key-value pair.
      // To escape this behaviour, pass in a function which will give you the old data and you can
      // do the merging on your own and the return value will be treated as the new slice.
      const newDataSlice =
        typeof data === "function" ? data(oldData) || {} : data;
      const newData: Resource_T<T> = { ...oldData, ...newDataSlice };
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
  dataKey?: ResourceKey_T,
  customContext = GlobalResourceContext
): ValueOf_Resource_T<T> {
  const [_, setCounter] = useState(0);
  const localValueRef = useRef<ValueOf_Resource_T<T>>();
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
  const callback: SelectorCallback_T<T> = (_data = resource) => {
    const value: ValueOf_Resource_T<T> = dataKey ? _data[dataKey] : _data;
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

/**
 * This hook is used for queuing up the requests.
 *
 * @param customContext ResourceContext where the event is published.
 * This is optional. If no value is provided then the default context will be used.
 * @returns A callback
 */
export function usePublish(customContext = GlobalResourceContext) {
  const { eventQueue } = useContext(customContext);
  const callback: PublishCallback_T = useCallback(
    (event) => {
      eventQueue.current.push(event);
    },
    [eventQueue]
  );
  return callback;
}
