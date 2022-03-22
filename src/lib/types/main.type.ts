import {
  MutableRefObject,
  ReactChild,
  ReactFragment,
  ReactPortal
} from "react";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import type { ChainedRequestConfigType } from "./useResource.type";

export interface DebugObject {
  timestamp: string;
  message?: string;
  data?: object;
}

export type Internal_JsxComponentType =
  | boolean
  | ReactChild
  | ReactFragment
  | ReactPortal
  | JSX.Element
  | null
  | undefined;

export type ErrorDataType = AxiosError | AxiosResponse | object | undefined;

export interface ResourceType<T> {
  data: T | undefined;
  isLoading: boolean;
  isFetching: boolean;
  errorData: ErrorDataType;
  debug: MutableRefObject<DebugObject[]>;
  cancel: any;
  errorMessage: string;
  refetch: (customConfig?: BaseConfigType) => void;
}

export type ValueOf<T> = T[keyof T];

export type ValueOf_ResourceType<T> =
  | ValueOf<ResourceType<T>>
  | ResourceType<T>;

/**
 * Resource type object keys
 */
export type ResourceKeyType<T> = keyof ResourceType<T>;

export type LoadingComponentType = (data: any) => JSX.Element;

export type FetchingComponentType = (data?: any) => JSX.Element;

export type ErrorComponentType = (
  errorMessage?: string,
  errorData?: any,
  data?: any
) => JSX.Element;
// export type ContentWrapper_DisplayOptions = {
//   whileFetching?: boolean;
//   onError?: boolean;
// };

export type ContentWrapperType = (props: {
  children: Internal_JsxComponentType;
  isLoading: boolean;
  isFetching: boolean;
  errorMessage: string;
  errorData: ErrorDataType;
  data: any;
}) => JSX.Element;

export interface ContextContainerPropsType {
  children?: Internal_JsxComponentType;
  loadingComponent?: LoadingComponentType;
  fetchingComponent?: FetchingComponentType;
  errorComponent?: ErrorComponentType;
  contentWrapper?: ContentWrapperType;
}

export type ContextContainerType = (
  props: ContextContainerPropsType
) => JSX.Element;

export type BaseConfigType = AxiosRequestConfig | ChainedRequestConfigType[];

export type ChainResponseType = object | AxiosResponse | void;
export type AccumulatorType = (object | AxiosResponse)[];
export type AccumulatorContainer = { current: AccumulatorType };
export type NextCallbackType = (
  data: ChainResponseType
) => AccumulatorContainer;

export type BeforeEventType = (
  accumulator?: AccumulatorContainer,
  next?: NextCallbackType,
  disableStateUpdate?: boolean
) => void;

export type EventType = (
  customConfig: AxiosRequestConfig,
  accumulator?: AccumulatorContainer,
  next?: NextCallbackType
) => Promise<AxiosResponse>;

export type OnSuccessType = (
  response: AxiosResponse,
  accumulator?: AccumulatorContainer,
  next?: NextCallbackType,
  disableStateUpdate?: boolean
) => void;

export type OnFailureType = (
  error: any | AxiosError,
  accumulator?: AccumulatorContainer,
  next?: NextCallbackType
) => void;

export type OnFinishType = (
  accumulator?: AccumulatorContainer,
  next?: NextCallbackType,
  disableStateUpdate?: boolean
) => void;

export type FullTaskType = (customConfig: AxiosRequestConfig) => void;

export type PushToAccumulatorType = (
  next: NextCallbackType | undefined,
  res: ChainResponseType | undefined
) => void;

export interface ContainerFactory_PropType<T> {
  globalLoadingComponent: LoadingComponentType;
  globalFetchingComponent: FetchingComponentType;
  globalErrorComponent: ErrorComponentType;
  errorData: ErrorDataType;
  resourceName: string;
  isLoading: boolean;
  isFetching: boolean;
  data: T;
  errorMessage: string;
}

export type ContainerFactoryType<T> = (
  props: ContainerFactory_PropType<T>
) => ContextContainerType;
