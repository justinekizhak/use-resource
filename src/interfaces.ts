import { ReactChild, ReactFragment, ReactPortal } from "react";
import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from "axios";

export interface DebugObject {
  timestamp: string;
  message?: string;
  data?: object;
}

export type JsxComponentType =
  | boolean
  | ReactChild
  | ReactFragment
  | ReactPortal
  | JSX.Element
  | null
  | undefined;

export type ResourceType = {
  data: object;
  isLoading: boolean;
  errorData: object | null | undefined;
  debug: DebugObject[];
  cancel: any;
  refetch: (customConfig: AxiosRequestConfig) => void;
};

export type ResourceContextState = {
  [key: string]: ResourceType;
};

export type ResourceContextType = ResourceContextState | null | undefined;

export type UseResourceOptionsType = {
  CustomContext?:
    | React.Context<ResourceContextType>
    | null
    | undefined
    | "global";
  triggerOn?: string | boolean | any[];
  onMountCallback?: (customAxios: AxiosInstance) => void;
};

export type LoadingComponentType = () => JSX.Element;
export type ErrorComponentType = (
  errorMessage: string,
  errorData: any
) => JSX.Element;

export type UseResourceAdvancedOptionsType = {
  globalLoadingComponent?: LoadingComponentType;
  globalErrorComponent?: ErrorComponentType;
  useMessageQueue?: boolean | object;
};

export type GlobalResourceContextType = {
  dispatch: (data: ResourceContextType) => void;
  selector: (data: any) => any;
};

export interface ContextContainerPropsType {
  children?: JsxComponentType;
  loadingComponent?: LoadingComponentType;
  errorComponent?: ErrorComponentType;
}

export type ContextContainerType = (
  props: ContextContainerPropsType
) => JSX.Element;

export interface UseResourceReturnType extends ResourceType {
  Container: ContextContainerType;
}

export type UseResourceType = (
  defaultConfig: AxiosRequestConfig,
  resourceName: string,
  options?: UseResourceOptionsType,
  advancedOptions?: UseResourceAdvancedOptionsType
) => UseResourceReturnType;

export type AccumulatorType = object[] | AxiosResponse[];
export type NextType = (
  data: AccumulatorType | AxiosResponse
) => AccumulatorType;

export type BeforeTaskType = (
  accumulator?: AccumulatorType,
  next?: NextType
) => AccumulatorType | void;

export type TaskType = (
  customConfig: AxiosRequestConfig,
  accumulator?: AccumulatorType,
  next?: NextType
) => Promise<AccumulatorType>;

export type OnSuccessType = (
  response: AxiosResponse | object,
  accumulator?: AccumulatorType,
  next?: NextType
) => AccumulatorType | void;

export type OnFailureType = (
  error: any | AxiosError,
  accumulator?: AccumulatorType,
  next?: NextType
) => AccumulatorType | void;

export type OnFinalType = (
  accumulator?: AccumulatorType,
  next?: NextType
) => AccumulatorType | void;

export interface ChainedRequestConfigType {
  baseConfig: AxiosRequestConfig;
  beforeTask?: BeforeTaskType;
  task?: TaskType;
  onSuccess?: OnSuccessType;
  onFailure?: OnFailureType;
  onFinal?: OnFinalType;
}

export type BaseConfigType = AxiosRequestConfig | ChainedRequestConfigType[];
