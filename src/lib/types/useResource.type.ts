import { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  TransformConfigType,
  TransformFailureType,
  TransformSuccessType
} from "./helpers.type";
import type {
  BaseConfigType,
  ResourceType,
  ContextContainerType,
  LoadingComponentType,
  ErrorComponentType,
  BeforeEventType,
  OnFailureType,
  OnFinishType,
  OnSuccessType,
  EventType,
  FetchingComponentType
} from "./main.type";
import { GlobalResourceContextType } from "./resourceContext/provider.type";

export type OnMountCallbackType = (customAxios: AxiosInstance) => void;
export type onUnmountCallback = () => void;

export interface UseResource_ContainerOptions_Type {
  loadingComponent?: LoadingComponentType;
  fetchingComponent?: FetchingComponentType;
  errorComponent?: ErrorComponentType;
  hideWhenLoading?: boolean;
}

export interface UseResourceOptionsType<T> {
  CustomContext?: React.Context<GlobalResourceContextType<T>> | undefined;
  triggerOn?: string | boolean | any[];
  onMountCallback?: OnMountCallbackType;
  onUnmountCallback?: onUnmountCallback;
  useMessageQueue?: boolean | object;
  useGlobalContext?: boolean;
  devMode?: boolean;
  deps?: any[];
  containerOptions?: UseResource_ContainerOptions_Type;
}

export interface UseResourceReturnType<T> extends ResourceType<T> {
  Container: ContextContainerType;
}

export type UseResourceType<T = object> = (
  defaultConfig: BaseConfigType,
  resourceName: string,
  options?: UseResourceOptionsType<T>
) => UseResourceReturnType<T>;

export interface ChainedRequestConfigType extends Object {
  baseConfig: AxiosRequestConfig;
  beforeEvent?: BeforeEventType;
  transformConfig?: TransformConfigType;
  transformSuccess?: TransformSuccessType;
  transformFailure?: TransformFailureType;
  onFinish?: OnFinishType;
  requestName?: string;
  dependencyList?: string[] | null | undefined;
}

/**
 * Used internally
 * @internal
 */
export interface Internal_ChainedRequestConfigType extends Object {
  baseConfig: AxiosRequestConfig;
  beforeEvent?: BeforeEventType;
  event?: EventType;
  onSuccess?: OnSuccessType;
  onFailure?: OnFailureType;
  onFinish?: OnFinishType;
}
