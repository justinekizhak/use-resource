import {
  MutableRefObject,
  ReactChild,
  ReactFragment,
  ReactPortal
} from "react";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import type {
  ChainedRequestConfig_T,
  UseResource_ContainerOptions__T
} from "./useResource.type";

/**
 * This object is stored in the debugger.
 */
export interface DebugObject_T {
  timestamp: string;
  message?: string;
  data?: object;
}

/**
 * Used internally.
 * @internal
 */
export type Internal_JsxComponent_T =
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
export type ErrorData_T = AxiosError | AxiosResponse | object | undefined;

export type ResourceCancelMethod_T = () => void;
export type ResourceRefetchMethod_T = (customConfig?: BaseConfig_T) => void;

/**
 * This is the resource object which is returned by the useResource hook.
 */
export interface Resource_T<T> {
  /**
   * The data of the resource.
   * Contains only the response data if the request was successful.
   * If you want to get the full response, then you can access it using the `transformSuccess` callback.
   * For more information, see the {@link TransformSuccess_T}
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
  errorData: ErrorData_T;
  /**
   * Contains all the info about the request lifecycle. This is useful for debugging.
   */
  debug: MutableRefObject<DebugObject_T[]>;
  /**
   * You can invoke this method to manually cancel the request.
   */
  cancel: ResourceCancelMethod_T;
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
  refetch: ResourceRefetchMethod_T;
}

export type ValueOf_Resource_T<T> =
  | T
  | boolean
  | ErrorData_T
  | string
  | MutableRefObject<DebugObject_T[]>
  | ResourceCancelMethod_T
  | ResourceRefetchMethod_T
  | undefined
  | Resource_T<T>;

/**
 * Resource type object keys
 */
export type ResourceKey_T =
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
 * @param props The component receives all of the `content-wrapper` props.
 * This will include all the resource data as well as the options it was passed.
 * @category Components
 * @category LoadingComponent
 */
export type LoadingComponent_T = (
  props: ContentWrapper_Props__T
) => JSX.Element;

/**
 * Component shown when the request is in progress.
 *
 * Shown for all the times when the request is in progress.
 *
 * @param props The component receives all of the `content-wrapper` props.
 * This will include all the resource data as well as the options it was passed.
 * @category Components
 * @category LoadingComponent
 */
export type FetchingComponent_T = (
  props: ContentWrapper_Props__T
) => JSX.Element;

/**
 * Component shown when there is an error.
 *
 * Shown after a request failed.
 *
 * @param props The component receives all of the `content-wrapper` props.
 * This will include all the resource data as well as the options it was passed.
 * @category Components
 * @category ErrorComponent
 */
export type ErrorComponent_T = (props: ContentWrapper_Props__T) => JSX.Element;

/**
 * This is the prop type for the content wrapper.
 *
 * This is also passed to the following components:
 * 1. {@link LoadingComponent_T}
 * 2. {@link FetchingComponent_T}
 * 3. {@link ErrorComponent_T}
 */
export interface ContentWrapper_Props__T
  extends UseResource_ContainerOptions__T {
  children: Internal_JsxComponent_T;
  isLoading: boolean;
  isFetching: boolean;
  errorMessage: string;
  errorData: ErrorData_T;
  data: any;
}

export type ContentWrapper_T = (props: ContentWrapper_Props__T) => JSX.Element;

export interface ContextContainerProps_T {
  children?: Internal_JsxComponent_T;
  contentWrapper?: ContentWrapper_T;
  containerOptions?: UseResource_ContainerOptions__T;
  hideWhenLoading: boolean;
}

export type ContextContainer_T = (
  props: ContextContainerProps_T
) => JSX.Element;

export type BaseConfig_T = AxiosRequestConfig | ChainedRequestConfig_T[];

export type ChainResponse_T = object | AxiosResponse | void;
export type Accumulator_T = (object | AxiosResponse)[];
export type AccumulatorContainer_T = { current: Accumulator_T };
export type PushToAcc_T = (data: ChainResponse_T) => AccumulatorContainer_T;

/**
 * This the lifecycle hook which runs before the event is initiated.
 *
 * @category LifecycleHook
 */
export type BeforeEvent_T = (
  accumulator?: AccumulatorContainer_T,
  pushToAcc?: PushToAcc_T,
  disableStateUpdate?: boolean
) => void;

/**
 * This the lifecycle hook which contains the API request event.
 *
 * @category LifecycleHook
 */
export type Event_T = (
  customConfig: AxiosRequestConfig,
  accumulator?: AccumulatorContainer_T,
  pushToAcc?: PushToAcc_T
) => Promise<AxiosResponse>;

/**
 * This the lifecycle hook which runs if the request is successful.
 *
 * @category LifecycleHook
 */
export type OnSuccess_T = (
  response: AxiosResponse,
  accumulator?: AccumulatorContainer_T,
  pushToAcc?: PushToAcc_T,
  disableStateUpdate?: boolean
) => void;

/**
 * This the lifecycle hook which runs if there is any error
 *
 * @category LifecycleHook
 */
export type OnFailure_T = (
  error: any | AxiosError,
  accumulator?: AccumulatorContainer_T,
  pushToAcc?: PushToAcc_T
) => void;

/**
 * This the lifecycle hook which runs after the event is completed.
 *
 * @category LifecycleHook
 */
export type OnFinish_T = (
  accumulator?: AccumulatorContainer_T,
  pushToAcc?: PushToAcc_T,
  disableStateUpdate?: boolean
) => void;

export type FullTask_T = (customConfig: AxiosRequestConfig) => void;

export type PushToAccumulator_T = (
  pushToAcc: PushToAcc_T | undefined,
  res: ChainResponse_T | undefined
) => void;

/**
 * Props for the ContainerFactory function.
 *
 * @category Props
 */
export interface ContainerFactory_Prop_T<T> {
  containerOptions: UseResource_ContainerOptions__T;
  errorData: ErrorData_T;
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
export type ContainerFactory_T<T> = (
  props: ContainerFactory_Prop_T<T>
) => ContextContainer_T;
