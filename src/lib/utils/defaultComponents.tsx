import type {
  ContainerFactoryType,
  ContentWrapperType,
  ContextContainerPropsType,
  ContextContainerType,
  ErrorComponentType,
  FetchingComponentType,
  LoadingComponentType
} from "../types/main.type";

/**
 * This is the default loading component that will be used if no loading component is provided.
 * @returns loading component
 */
export const defaultLoadingComponent: LoadingComponentType = () => (
  <div className="loading"> Loading... </div>
);

/**
 * This is the default fetching component that will be used if no fetching component is provided.
 * @returns Fetching component
 */
export const defaultFetchingComponent: FetchingComponentType = () => (
  <div className="fetching">Fetching...</div>
);

/**
 * This is the default error message component that will be used if no error message component is provided
 * @param errorMessage string
 * @returns Error message component
 */
export const defaultErrorComponent: ErrorComponentType = (errorMessage) => (
  <div className="error-message"> {errorMessage} </div>
);

/**
 *
 * @param factoryProps
 * @returns
 */
export const containerFactory: ContainerFactoryType<any> = ({
  globalLoadingComponent,
  globalFetchingComponent,
  globalErrorComponent,
  errorData,
  resourceName,
  isLoading,
  isFetching,
  data,
  errorMessage
}) => {
  /**
   * All the logic for the container-factory should be inside this.
   * @param param0
   * @returns
   */
  const component: ContextContainerType = ({
    children,
    loadingComponent = globalLoadingComponent,
    fetchingComponent = globalFetchingComponent,
    errorComponent = globalErrorComponent,
    contentWrapper = undefined,
    hideWhenLoading = false
  }: ContextContainerPropsType) => {
    /**
     *
     * All the logic inside the container instance should be inside this.
     * @param props
     * @returns
     */
    const defaultWrapper: ContentWrapperType = (props) => {
      // Show content if loading or fetching is false and the hideWhenLoading flag is false
      // If the hideWhenLoading flag is true, then always show the content.
      const showContent = !(isLoading || isFetching) || !hideWhenLoading;
      return (
        <div className="content">
          {props.isLoading && loadingComponent(props)}
          {!props.isLoading && props.isFetching && fetchingComponent(props)}
          {props.errorMessage &&
            errorComponent(props.errorMessage, props.errorData, props.data)}
          {showContent ? props.children : null}
        </div>
      );
    };

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

  return component;
};
