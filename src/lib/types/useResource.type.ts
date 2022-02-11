import { AxiosInstance } from "axios";

import {
  BaseConfigType,
  ResourceType,
  ContextContainerType,
  LoadingComponentType,
  ErrorComponentType
} from "./index.type";

import { ResourceContextType } from "./resourceContext/context.type";

export interface UseResourceOptionsType {
  CustomContext?: React.Context<ResourceContextType> | null | undefined;
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
