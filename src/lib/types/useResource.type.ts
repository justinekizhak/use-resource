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
  BeforeTaskType,
  OnFailureType,
  OnFinalType,
  OnSuccessType,
  TaskType
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

export interface ChainedRequestInputConfigType extends Object {
  baseConfig: AxiosRequestConfig;
  beforeTask?: BeforeTaskType;
  transformConfig?: TransformConfigType;
  transformSuccess?: TransformSuccessType;
  transformFailure?: TransformFailureType;
  onFinal?: OnFinalType;
}

export interface ChainedRequestConfigType extends Object {
  baseConfig: AxiosRequestConfig;
  beforeTask?: BeforeTaskType;
  task?: TaskType;
  onSuccess?: OnSuccessType;
  onFailure?: OnFailureType;
  onFinal?: OnFinalType;
}
