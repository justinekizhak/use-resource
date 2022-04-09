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

export interface ChainedRequestConfig_T extends Object {
  baseConfig: AxiosRequestConfig;
  beforeEvent?: BeforeEvent_T;
  transformConfig?: TransformConfig_T;
  transformSuccess?: TransformSuccess_T;
  transformFailure?: TransformFailure_T;
  onFinish?: OnFinish_T;
  requestName?: string;
  dependencyList?: string[] | null | undefined;
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
