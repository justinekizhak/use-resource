import { MutableRefObject } from "react";
import type {
  AccumulatorContainer,
  BaseConfigType,
  BeforeTaskType,
  NextType,
  OnFailureType,
  OnFinalType,
  OnSuccessType,
  TaskType
} from "./main.type";

export interface RefetchFunctionArgType {
  accumulator: AccumulatorContainer;
  defaultNext: NextType;
  beforeTask: BeforeTaskType;
  task: TaskType;
  onSuccess: OnSuccessType;
  onFailure: OnFailureType;
  onFinal: OnFinalType;
  isMessageQueueAvailable: boolean;
  messageQueueName: string;
  pushToMessageQueue: (data: any) => void;
  useRequestChaining: boolean;
  baseConfigRef: MutableRefObject<BaseConfigType>;
  controllerInstance: MutableRefObject<AbortController>;
}

export type RefetchFunctionType = (
  args: RefetchFunctionArgType
) => (customConfig?: BaseConfigType) => void;
