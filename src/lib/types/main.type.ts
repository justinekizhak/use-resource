import {
  MutableRefObject,
  ReactChild,
  ReactFragment,
  ReactPortal
} from "react";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import type { ChainedRequestConfigType } from "./useResource.type";

/**
 * This object is stored in the debugger.
 */
export interface DebugObject {
  timestamp: string;
  message?: string;
  data?: object;
}

/**
 * Used internally.
 * @internal
 */
export type Internal_JsxComponentType =
  | boolean
  | ReactChild
  | ReactFragment
  | ReactPortal
  | JSX.Element
  | null
  | undefined;

/**
 * Contains the error information of a failed request.
 */
export type ErrorDataType = AxiosError | AxiosResponse | object | undefined;

export type ResourceCancelMethodType = () => void;
export type ResourceRefetchMethodType = (customConfig?: BaseConfigType) => void;

/**
 * This is the resource object which is returned by the useResource hook.
 */
export interface ResourceType<T> {
  /**
   * The data of the resource.
   * Contains only the response data if the request was successful.
   * If you want to get the full response, then you can access it using the `transformSuccess` callback.
   * For more information, see the {@link TransformSuccessType}
   */
  data: T | undefined;
  /**
   * This value describes if the request is in progress or not.
   *
   * This value will only be true for the first request.
   * Once the hook is mounted this is not going to be used anymore.
   *
   * For the subsequent request use the {@link isFetching} property.
   */
  isLoading: boolean;
  /**
   * This value describes if the request is in progress or not.
   *
   * For showing a loading indicator only for the first time on mount, use the {@link isLoading} property.
   *
   * This flag is also set for the initial loading as well.
   * For all other purposes, feel free to use this property.
   */
  isFetching: boolean;
  /**
   * Contains the error data if the request failed.
   */
  errorData: ErrorDataType;
  /**
   * Contains all the info about the request lifecycle. This is useful for debugging.
   */
  debug: MutableRefObject<DebugObject[]>;
  /**
   * You can invoke this method to manually cancel the request.
   */
  cancel: ResourceCancelMethodType;
  /**
   * This field will contain the request error message if the request failed.
   */
  errorMessage: string;
  /**
   * This method can be used to trigger the request manually.
   *
   * Only GET request are triggered on mount(unless you pass the {@link triggerOn} option).
   *
   * Apart from GET request for all other request you will have to use this method to
   * trigger the request manually.
   *
   * @param customConfig You can pass in custom config to override the default config.
   */
  refetch: ResourceRefetchMethodType;
}

export type ValueOf_ResourceType<T> =
  | T
  | boolean
  | ErrorDataType
  | string
  | MutableRefObject<DebugObject[]>
  | ResourceCancelMethodType
  | ResourceRefetchMethodType
  | undefined
  | ResourceType<T>;

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
  | "errorMessage"
  | "refetch";

/**
 * Component shown when the request is in progress.
 *
 * Runs only for the first time when the request is in progress.
 *
 * This is useful when you have separate loading indicator for the initial loading
 * and subsequent loading.
 *
 * @param data TODO
 * @category Components
 * @category LoadingComponent
 */
export type LoadingComponentType = (data: any) => JSX.Element;

/**
 * Component shown when the request is in progress.
 *
 * Shown for all the times when the request is in progress.
 *
 * @param data TODO
 * @category Components
 * @category LoadingComponent
 */
export type FetchingComponentType = (data?: any) => JSX.Element;

export type ErrorComponentType = (
  errorMessage?: string,
  errorData?: any,
  data?: any
) => JSX.Element;

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
  hideWhenLoading?: boolean;
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

/**
 * This the lifecycle hook which runs before the event is initiated.
 *
 * @category LifecycleHook
 */
export type BeforeEventType = (
  accumulator?: AccumulatorContainer,
  next?: NextCallbackType,
  disableStateUpdate?: boolean
) => void;

/**
 * This the lifecycle hook which contains the API request event.
 *
 * @category LifecycleHook
 */
export type EventType = (
  customConfig: AxiosRequestConfig,
  accumulator?: AccumulatorContainer,
  next?: NextCallbackType
) => Promise<AxiosResponse>;

/**
 * This the lifecycle hook which runs if the request is successful.
 *
 * @category LifecycleHook
 */
export type OnSuccessType = (
  response: AxiosResponse,
  accumulator?: AccumulatorContainer,
  next?: NextCallbackType,
  disableStateUpdate?: boolean
) => void;

/**
 * This the lifecycle hook which runs if there is any error
 *
 * @category LifecycleHook
 */
export type OnFailureType = (
  error: any | AxiosError,
  accumulator?: AccumulatorContainer,
  next?: NextCallbackType
) => void;

/**
 * This the lifecycle hook which runs after the event is completed.
 *
 * @category LifecycleHook
 */
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

/**
 * Props for the ContainerFactory function.
 *
 * @category Props
 */
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

/**
 * Factory function for generating Container components.
 *
 * @category Components
 */
export type ContainerFactoryType<T> = (
  props: ContainerFactory_PropType<T>
) => ContextContainerType;
