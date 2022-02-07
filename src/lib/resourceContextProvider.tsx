import React, { useState, useCallback } from "react";

import {
  JsxComponentType,
  ResourceContextType,
  ResourceContextState,
  DispatchCallbackType
} from "./interfaces";

import { GlobalResourceContext } from "./resourceContext";

export const GlobalResourceContextProvider = (props: {
  children: JsxComponentType;
}) => {
  const [state, setState] = useState<ResourceContextState>({});

  const dispatch = useCallback((inputData: ResourceContextType) => {
    if (!inputData) {
      return;
    }
    setState((oldData) => {
      const newData = { ...oldData, ...inputData };
      return newData;
    });
  }, []);

  const selector = useCallback(
    (callback): DispatchCallbackType => {
      const res = callback(state);
      return res;
    },
    [state]
  );

  return (
    <GlobalResourceContext.Provider value={{ dispatch, selector }}>
      {props.children}
    </GlobalResourceContext.Provider>
  );
};
