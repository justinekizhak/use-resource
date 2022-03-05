import { useRef, useEffect } from "react";

import type { Internal_JsxComponentType } from "../types/main.type";
import type {
  ContextCallbackState,
  EventQueue_DataType
} from "../types/resourceContext/provider.type";
import type { ResourceContextState } from "../types/resourceContext/context.type";

import { GlobalResourceContext } from "./context";
import { handleEvent } from "./handleEvents";

export const GlobalResourceContextProvider = (props: {
  children: Internal_JsxComponentType;
}) => {
  const state = useRef<ResourceContextState<any>>({});
  const stateCallbacks = useRef<ContextCallbackState>({});
  const eventQueue = useRef<EventQueue_DataType[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (eventQueue.current.length > 0) {
        handleEvent(eventQueue);
      }
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlobalResourceContext.Provider
      value={{ state, stateCallbacks, eventQueue }}
    >
      {props.children}
    </GlobalResourceContext.Provider>
  );
};
