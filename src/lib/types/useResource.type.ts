import { AxiosInstance } from "axios";
import {
  BaseConfigType,
  ResourceType,
  ContextContainerType,
  LoadingComponentType,
  ErrorComponentType
} from "./main.type";
export type { ChainedRequestConfigType } from "./main.type";

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
