import type {
  ContainerFactoryType,
  ContentWrapperType,
  ContextContainerPropsType,
  ErrorComponentType,
  FetchingComponentType,
  LoadingComponentType
} from "lib/types/main.type";
import { getErrorMessage } from "lib/utils/helpers";

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

export const containerFactory: ContainerFactoryType<any> = ({
  globalLoadingComponent,
  globalFetchingComponent,
  globalErrorComponent,
  errorData,
  resourceName,
  isLoading,
  isFetching,
  data
}) => ({
  children,
  loadingComponent = globalLoadingComponent,
  fetchingComponent = globalFetchingComponent,
  errorComponent = globalErrorComponent,
  contentWrapper = undefined
}: ContextContainerPropsType) => {
  const errorMessage = getErrorMessage(errorData);

  const defaultWrapper: ContentWrapperType = (props) => (
    <div className="content">
      {props.isLoading && loadingComponent(props.data)}
      {!props.isLoading && props.isFetching && fetchingComponent(props.data)}
      {props.errorMessage &&
        errorComponent(props.errorMessage, props.errorData, props.data)}
      {props.children}
    </div>
  );

  const wrapper = contentWrapper || defaultWrapper;

  return (
    <div className={`resource-${resourceName}`}>
      {wrapper({
        children,
        isLoading,
        isFetching,
        errorMessage,
        errorData,
        data
      })}
    </div>
  );
};
