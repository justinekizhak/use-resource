import React from "react";

import { ErrorComponentType, LoadingComponentType } from "../types/main.type";

export const defaultLoadingComponent: LoadingComponentType = () => (
  <div className="loading"> Loading... </div>
);
export const defaultErrorComponent: ErrorComponentType = (
  errorMessage: string,
  errorData: any
) => <div className="error-message"> {errorMessage} </div>;
