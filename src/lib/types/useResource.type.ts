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

export interface UseResourceOptionsType<T> {
  CustomContext?: React.Context<GlobalResourceContextType<T>> | undefined;
  triggerOn?: string | boolean | any[];
  onMountCallback?: (customAxios: AxiosInstance) => void;
  globalLoadingComponent?: LoadingComponentType;
  globalFetchingComponent?: FetchingComponentType;
  globalErrorComponent?: ErrorComponentType;
  useMessageQueue?: boolean | object;
  useGlobalContext?: boolean;
  devMode?: boolean;
  deps?: any[];
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
