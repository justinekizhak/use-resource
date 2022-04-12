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
 */
export interface ChainedRequestConfig_T extends Object {
  baseConfig: AxiosRequestConfig;
  beforeEvent?: BeforeEvent_T;
  transformConfig?: TransformConfig_T;
  transformSuccess?: TransformSuccess_T;
  transformFailure?: TransformFailure_T;
  onFinish?: OnFinish_T;
  requestName?: string;
  dependencyList?: string[] | null | undefined;
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
