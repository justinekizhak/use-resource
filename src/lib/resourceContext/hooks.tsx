import { useCallback, useContext, useState } from "react";
import { compareObject } from "../utils/helpers";

import type { ResourceKeyType } from "../types/main.type";
import type {
  DispatchType,
  PublishCallbackType,
  SelectorCallbackType
} from "../types/resourceContext/provider.type";

import { GlobalResourceContext } from "./context";

export function useDispatch<T>(
  customContext = GlobalResourceContext
): DispatchType<T> {
  const { state, stateCallbacks } = useContext(customContext);
  const returnCallback: DispatchType<T> = useCallback(
    (key, data) => {
      if (!key || !data) {
        return;
      }
      const updateKey = Object.keys(data)[0] as ResourceKeyType<T>;
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
    },
    [state, stateCallbacks]
  );
  return returnCallback;
}

export function useSelector<T>(
  resourceName: string,
  dataKey: ResourceKeyType<T>,
  customContext = GlobalResourceContext
) {
  const [localValue, setLocalValue] = useState();
  const { state, stateCallbacks } = useContext(customContext);
  if (!resourceName) {
    return;
  }
  const existingCallbacks = stateCallbacks.current[resourceName];
  if (!existingCallbacks) {
    stateCallbacks.current[resourceName] = [];
  }
  const resource = state.current[resourceName];
  const callback: SelectorCallbackType<T> = (_data = resource) => {
    if (!dataKey) {
      console.log("Data key is empty");
      return;
    }
    const value = _data[dataKey];
    if (localValue && compareObject(localValue, value)) {
      return;
    }
    setLocalValue(value);
  };
  stateCallbacks.current[resourceName].push(callback);
  return localValue;
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
