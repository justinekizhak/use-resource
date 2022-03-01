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
  EventType
} from "./main.type";

export interface UseResourceOptionsType<T> {
  CustomContext?: React.Context<ResourceType<T>> | null | undefined;
  triggerOn?: string | boolean | any[];
  onMountCallback?: (customAxios: AxiosInstance) => void;
  globalLoadingComponent?: LoadingComponentType;
  globalErrorComponent?: ErrorComponentType;
  useMessageQueue?: boolean | object;
  useGlobalContext?: boolean;
  devMode?: boolean;
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

export interface Internal_ChainedRequestConfigType extends Object {
  baseConfig: AxiosRequestConfig;
  beforeEvent?: BeforeEventType;
  event?: EventType;
  onSuccess?: OnSuccessType;
  onFailure?: OnFailureType;
  onFinish?: OnFinishType;
}
