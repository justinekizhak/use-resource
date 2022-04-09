import { UseResource_ContainerOptions__T } from "lib/types";
import type {
  ContainerFactory_T,
  ContentWrapper_T,
  ContextContainerProps_T,
  ContextContainer_T,
  ErrorComponent_T,
  FetchingComponent_T,
  LoadingComponent_T
} from "../types/main.type";

/**
 * This is the default loading component that will be used if no loading component is provided.
 * @returns loading component
 */
export const defaultLoadingComponent: LoadingComponent_T = () => (
  <div className="loading"> Loading... </div>
);

/**
 * This is the default fetching component that will be used if no fetching component is provided.
 * @returns Fetching component
 */
export const defaultFetchingComponent: FetchingComponent_T = () => (
  <div className="fetching">Fetching...</div>
);

/**
 * This is the default error message component that will be used if no error message component is provided
 * @param errorMessage string
 * @returns Error message component
 */
export const defaultErrorComponent: ErrorComponent_T = ({ errorMessage }) => (
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
export const containerFactory: ContainerFactory_T<any> = ({
  containerOptions,
  errorData,
  resourceName,
  isLoading,
  isFetching,
  data,
  errorMessage
}) => {
  const defaultContainerOptions: UseResource_ContainerOptions__T = {
    loadingComponent: defaultLoadingComponent,
    fetchingComponent: defaultFetchingComponent,
    errorComponent: defaultErrorComponent,
    hideWhenLoading: false
  };

  const mergedContainerOptions: UseResource_ContainerOptions__T = {
    ...defaultContainerOptions,
    ...containerOptions
  };
  /**
   * All the logic for the container-factory should be inside this.
   * @param param0
   * @returns
   */
  const ContentComponent: ContextContainer_T = ({
    children,
    contentWrapper = undefined,
    containerOptions = mergedContainerOptions
  }: ContextContainerProps_T) => {
    /**
     *
     * All the logic inside the container instance should be inside this.
     * @param props
     * @returns
     */
    const defaultWrapper: ContentWrapper_T = (props) => {
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
