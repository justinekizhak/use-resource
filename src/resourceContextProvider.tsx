import React, { useState, useCallback } from "react";

import {
  JsxComponentType,
  ResourceContextType,
  ResourceContextState
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
    (callback: (state: ResourceContextState) => any) => {
      return callback(state);
    },
    [state]
  );

  return (
    <GlobalResourceContext.Provider value={{ dispatch, selector }}>
      {props.children}
    </GlobalResourceContext.Provider>
  );
};
