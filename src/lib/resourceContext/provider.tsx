import { useRef } from "react";

import type { Internal_JsxComponentType } from "../types/main.type";
import type { ContextCallbackState } from "../types/resourceContext/provider.type";
import type { ResourceContextState } from "../types/resourceContext/context.type";

import { GlobalResourceContext } from "./context";

export const GlobalResourceContextProvider = (props: {
  children: Internal_JsxComponentType;
}) => {
  const state = useRef<ResourceContextState<any>>({});
  const stateCallbacks = useRef<ContextCallbackState>({});

  return (
    <GlobalResourceContext.Provider value={{ state, stateCallbacks }}>
      {props.children}
    </GlobalResourceContext.Provider>
  );
};
