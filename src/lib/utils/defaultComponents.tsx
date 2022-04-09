import { UseResource_ContainerOptions_Type } from "lib/types";
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
export const defaultErrorComponent: ErrorComponentType = ({ errorMessage }) => (
  <div className="error-message"> {errorMessage} </div>
);

/**
 * The container factory receives all the data from the hook, but all the display logic is
 * done in the `content-wrapper` inside the `content-component`.
 *
 * First the `factory-function` receives all the data and returns a `container-component`.
 * The `container-component` will merge the `container-options` with the `default-options`.
 *
 * This merged options is then passed down to the `content-wrapper`.
 *
 * Inside the
 * @param factoryProps
 * @returns
 *
 * @internal
 */
export const containerFactory: ContainerFactoryType<any> = ({
  containerOptions,
  errorData,
  resourceName,
  isLoading,
  isFetching,
  data,
  errorMessage
}) => {
  const defaultContainerOptions: UseResource_ContainerOptions_Type = {
    loadingComponent: defaultLoadingComponent,
    fetchingComponent: defaultFetchingComponent,
    errorComponent: defaultErrorComponent,
    hideWhenLoading: false
  };

  const mergedContainerOptions: UseResource_ContainerOptions_Type = {
    ...defaultContainerOptions,
    ...containerOptions
  };
  /**
   * All the logic for the container-factory should be inside this.
   * @param param0
   * @returns
   */
  const ContentComponent: ContextContainerType = ({
    children,
    contentWrapper = undefined,
    containerOptions = mergedContainerOptions
  }: ContextContainerPropsType) => {
    /**
     *
     * All the logic inside the container instance should be inside this.
     * @param props
     * @returns
     */
    const defaultWrapper: ContentWrapperType = (props) => {
      const {
        loadingComponent = () => {},
        fetchingComponent = () => {},
        errorComponent = () => {},
        hideWhenLoading = false
      } = props;
      // Show content if loading or fetching is false and the hideWhenLoading flag is false
      // If the hideWhenLoading flag is true, then always show the content.
      const showContent = !(isLoading || isFetching) || !hideWhenLoading;
      return (
        <div className="content">
          {props.isLoading && loadingComponent(props)}
          {!props.isLoading && props.isFetching && fetchingComponent(props)}
          {props.errorMessage && errorComponent(props)}
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
          data,
          ...containerOptions
        })}
      </div>
    );
  };

  return ContentComponent;
};
