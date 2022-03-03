import type {
  ErrorComponentType,
  FetchingComponentType,
  LoadingComponentType
} from "../types/main.type";

export const defaultLoadingComponent: LoadingComponentType = (data) => (
  <div className="loading"> Loading... </div>
);

export const defaultFetchingComponent: FetchingComponentType = (data) => (
  <div className="fetching">
    Fetching...
    {JSON.stringify(data)}
  </div>
);

export const defaultErrorComponent: ErrorComponentType = (
  errorMessage,
  errorData,
  data
) => <div className="error-message"> {errorMessage} </div>;
