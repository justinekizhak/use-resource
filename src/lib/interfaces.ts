import {
  MutableRefObject,
  ReactChild,
  ReactFragment,
  ReactPortal
} from "react";
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
  debug: MutableRefObject<DebugObject[]>;
  cancel: any;
  refetch: (customConfig: BaseConfigType) => void;
};

export type ResourceContextState = {
  [key: string]: ResourceType;
};

export type ResourceContextType = ResourceContextState | null | undefined;

export type UseResourceBasicOptionsType = {
  CustomContext?: React.Context<ResourceContextType> | null | undefined;
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
  useGlobalContext?: boolean;
  devMode?: boolean;
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

export type BaseConfigType = AxiosRequestConfig | ChainedRequestConfigType[];

export type UseResourceType = (
  defaultConfig: BaseConfigType,
  resourceName: string,
  options?: UseResourceOptionsType
) => UseResourceReturnType;

export type ChainResponseType = object | AxiosResponse | void;
export type AccumulatorType = (object | AxiosResponse)[];
export type AccumulatorContainer = { current: AccumulatorType };
export type NextType = (data: ChainResponseType) => AccumulatorContainer;

export type BeforeTaskType = (
  accumulator?: AccumulatorContainer,
  next?: NextType,
  disableStateUpdate?: boolean
) => AxiosRequestConfig | void;

export type TaskType = (
  customConfig: AxiosRequestConfig,
  accumulator?: AccumulatorContainer,
  next?: NextType
) => Promise<ChainResponseType>;

export type OnSuccessType = (
  response: ChainResponseType,
  accumulator?: AccumulatorContainer,
  next?: NextType,
  disableStateUpdate?: boolean
) => ChainResponseType;

export type OnFailureType = (
  error: any | AxiosError,
  accumulator?: AccumulatorContainer,
  next?: NextType
) => ChainResponseType;

export type OnFinalType = (
  accumulator?: AccumulatorContainer,
  next?: NextType,
  disableStateUpdate?: boolean
) => ChainResponseType;

export interface ChainedRequestConfigType extends Object {
  baseConfig: AxiosRequestConfig;
  beforeTask?: BeforeTaskType;
  task?: TaskType;
  onSuccess?: OnSuccessType;
  onFailure?: OnFailureType;
  onFinal?: OnFinalType;
}

export interface UseResourceOptionsType
  extends UseResourceBasicOptionsType,
    UseResourceAdvancedOptionsType {}

export type DispatchCallbackType = (state: ResourceContextState) => any;

export type PushToAccumulatorType = (
  next: NextType | undefined,
  res: ChainResponseType | undefined
) => void;
