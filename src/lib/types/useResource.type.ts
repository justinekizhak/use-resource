import { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  TransformConfig_T,
  TransformFailure_T,
  TransformSuccess_T
} from "./helpers.type";
import type {
  BaseConfig_T,
  Resource_T,
  ContextContainer_T,
  LoadingComponent_T,
  ErrorComponent_T,
  BeforeEvent_T,
  OnFailure_T,
  OnFinish_T,
  OnSuccess_T,
  Event_T,
  FetchingComponent_T
} from "./main.type";
import { GlobalResourceContext_T } from "./resourceContext/provider.type";

export type OnMountCallback_T = (customAxios: AxiosInstance) => void;
export type OnUnmountCallback_T = () => void;

export interface UseResource_ContainerOptions__T {
  loadingComponent?: LoadingComponent_T;
  fetchingComponent?: FetchingComponent_T;
  errorComponent?: ErrorComponent_T;
  hideWhenLoading?: boolean;
}

export interface UseResourceOptions_T<T> {
  CustomContext?: React.Context<GlobalResourceContext_T<T>> | undefined;
  triggerOn?: string | boolean | any[];
  onMountCallback?: OnMountCallback_T;
  onUnmountCallback?: OnUnmountCallback_T;
  useMessageQueue?: boolean | object;
  useGlobalContext?: boolean;
  devMode?: boolean;
  deps?: any[];
  containerOptions?: UseResource_ContainerOptions__T;
}

export interface UseResourceReturn_T<T> extends Resource_T<T> {
  Container: ContextContainer_T;
}

export type UseResource_T<T = object> = (
  defaultConfig: BaseConfig_T,
  resourceName: string,
  options?: UseResourceOptions_T<T>
) => UseResourceReturn_T<T>;

/**
 * Request chains is one of the most powerful tool in the use-resource-hook.
 *
 * A request chain is a series of requests that are chained by their dependencies.
 *
 * Unlike other solutions where all the requests in a request-chain are triggered one after the other(waterfall style),
 * a request-chain is triggered when its dependencies are resolved.
 *
 * Example:
 *
 * A -> B -> D -> E
 * \--> C ------>/
 *
 * In a request-chain where
 * request A: doesn't have any dependencies
 * request B: depends on A
 * request C: depends also on A
 * request D: depends on B
 * request E: depends on D and C
 *
 * Here A is triggered immediately,
 * B and C are triggered when A is resolved,
 * D is triggered when B is resolved,
 * E is triggered when D and C are resolved.
 *
 * This way of dealing with event-requests (API requests) is very powerful and can be used to build a complex application.
 *
 * What is event-request?
 * In use-resource-hook, an event-request can be either an API request or it can also be a custom event
 * which doesn't involve sending any API request.
 *
 * We have deliberatly designed use-resource-hook to provide support for unorthodox use-cases as well.
 *
 * @category request-chain
 */
export interface ChainedRequestConfig_T extends Object {
  /**
   * The request config
   */
  baseConfig: AxiosRequestConfig;
  /**
   * This is the event-hook which runs before the request is initialized.
   *
   * The event-hooks can also return a promise which will be resolved before the execution is resumed.
   * @category Event hook
   */
  onStart?: BeforeEvent_T;
  /**
   * This is the transformation-hook which runs after the request is initialized, but before the event is triggered.
   * It receives the axios request config.
   *
   * The transformation-hooks shouldn't contain any async logic as they are executed synchronously.
   *
   * The difference between event-hook and transformation-hook is that:
   * 1. Transformation hooks takes in a data object and it should return either a new/modified data object. The output of
   * transformation-hooks is directly used in the execution of the remaining event-hooks.
   * If the transformation-hook doesn't return anything then the input data-object is used as is.
   * 2. Event hooks can return a promise which will be resolved before the execution is resumed.
   * @category Transformation hook
   */
  transformConfig?: TransformConfig_T;
  /**
   * This transformation-hook is called when the request is successful.
   * It receives the axios response object without any modifications.
   *
   * @category Transformation hook
   */
  transformSuccess?: TransformSuccess_T;
  /**
   * This transformation-hook is called when the request fails.
   * It receives the axios response object or the axios error object without any modifications.
   *
   * @category Transformation hook
   */
  transformFailure?: TransformFailure_T;
  /**
   * This is the event-hook which runs after the request is completed.
   * @category Event hook
   */
  onFinish?: OnFinish_T;
  /**
   * You can specify a name for a request which is used in the dependency tracking.
   */
  requestName?: string;
  /**
   * Optional dependencyList which you can use to declare any pre-requisite
   * requests that should be resolved before this request is triggered.
   */
  dependencyList?: string[] | null | undefined;
  /**
   * Pass in a custom event which will replace the default API request event.
   */
  customEvent?: Event_T | (() => any);
}

/**
 * Used internally
 * @internal
 */
export interface Internal_ChainedRequestConfig_T extends Object {
  baseConfig: AxiosRequestConfig;
  beforeEvent?: BeforeEvent_T;
  event?: Event_T;
  onSuccess?: OnSuccess_T;
  onFailure?: OnFailure_T;
  onFinish?: OnFinish_T;
}
