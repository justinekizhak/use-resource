import { AxiosInstance, AxiosRequestConfig } from "axios";
import { TransformInputType } from "./helpers.type";

import {
  BaseConfigType,
  ResourceType,
  ContextContainerType,
  LoadingComponentType,
  ErrorComponentType,
  BeforeTaskType,
  OnFailureType,
  OnFinalType,
  OnSuccessType
} from "./index.type";

export interface UseResourceOptionsType {
  CustomContext?: React.Context<ResourceType> | null | undefined;
  triggerOn?: string | boolean | any[];
  onMountCallback?: (customAxios: AxiosInstance) => void;
  globalLoadingComponent?: LoadingComponentType;
  globalErrorComponent?: ErrorComponentType;
  useMessageQueue?: boolean | object;
  useGlobalContext?: boolean;
  devMode?: boolean;
}

export interface UseResourceReturnType extends ResourceType {
  Container: ContextContainerType;
}

export type UseResourceType = (
  defaultConfig: BaseConfigType,
  resourceName: string,
  options?: UseResourceOptionsType
) => UseResourceReturnType;

export interface ChainedRequestConfigType extends Object {
  baseConfig: AxiosRequestConfig;
  beforeTask?: BeforeTaskType;
  task?: TransformInputType;
  onSuccess?: OnSuccessType;
  onFailure?: OnFailureType;
  onFinal?: OnFinalType;
}
