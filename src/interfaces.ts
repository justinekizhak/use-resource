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
export type AccumulatorContainer = { current: AccumulatorType };
export type NextType = (data: object | AxiosResponse) => AccumulatorContainer;

export type BeforeTaskType = (
  accumulator?: AccumulatorContainer,
  next?: NextType
) => AccumulatorType | void;

export type TaskType = (
  customConfig: AxiosRequestConfig,
  accumulator?: AccumulatorContainer,
  next?: NextType
) => Promise<AxiosResponse>;

export type OnSuccessType = (
  response: AxiosResponse | object,
  accumulator?: AccumulatorContainer,
  next?: NextType
) => AccumulatorType | void;

export type OnFailureType = (
  error: any | AxiosError,
  accumulator?: AccumulatorContainer,
  next?: NextType
) => AccumulatorType | void;

export type OnFinalType = (
  accumulator?: AccumulatorContainer,
  next?: NextType
) => AccumulatorType | void;

export interface ChainedRequestConfigType extends Object {
  baseConfig: AxiosRequestConfig;
  beforeTask?: BeforeTaskType;
  task?: TaskType;
  onSuccess?: OnSuccessType;
  onFailure?: OnFailureType;
  onFinal?: OnFinalType;
}

export type BaseConfigType = AxiosRequestConfig | ChainedRequestConfigType[];
