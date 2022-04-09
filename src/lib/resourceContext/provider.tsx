import type { EventQueue_Data_T } from "../types/resourceContext/eventQueue.type";
import { useEffect, useRef } from "react";
import type { Internal_JsxComponent_T } from "../types/main.type";
import type { ResourceContextState_T } from "../types/resourceContext/context.type";
import type { ContextCallbackState } from "../types/resourceContext/provider.type";
import { GlobalResourceContext } from "./context";
import { handleEvent } from "./handleEvents";

export const GlobalResourceContextProvider = (props: {
  children: Internal_JsxComponent_T;
}) => {
  const state = useRef<ResourceContextState_T<any>>({});
  const stateCallbacks = useRef<ContextCallbackState>({});
  const eventQueue = useRef<EventQueue_Data_T[]>([]);

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
