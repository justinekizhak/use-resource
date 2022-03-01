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

export type ResourceType<T> = {
  data: T | undefined;
  isLoading: boolean;
  isFetching: boolean;
  errorData: object | null | undefined;
  debug: MutableRefObject<DebugObject[]>;
  cancel: any;
  refetch: (customConfig?: BaseConfigType) => void;
};

/**
 * Resource type object keys
 */
export type ResourceKeyType =
  | "data"
  | "isLoading"
  | "isFetching"
  | "errorData"
  | "debug"
  | "cancel"
  | "refetch";

export type LoadingComponentType = () => JSX.Element;
export type ErrorComponentType = (
  errorMessage: string,
  errorData: any
) => JSX.Element;

export interface ContextContainerPropsType {
  children?: Internal_JsxComponentType;
  loadingComponent?: LoadingComponentType;
  errorComponent?: ErrorComponentType;
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

export type PushToAccumulatorType = (
  next: NextCallbackType | undefined,
  res: ChainResponseType | undefined
) => void;
