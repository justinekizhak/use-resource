import { AxiosRequestConfig } from "axios";
import {
  AccumulatorContainer,
  BeforeEventType,
  NextCallbackType,
  OnFailureType,
  OnFinishType,
  OnSuccessType
} from "lib/types";
import {
  EventQueueType,
  EventQueue_DataType
} from "lib/types/resourceContext/provider.type";

const getDeDuplicatedEventSlice = (queueSlice: EventQueue_DataType[]) => {
  const eventMap: {
    [key: string]: EventQueue_DataType[];
  } = {};
  queueSlice?.forEach((event) => {
    const key = event.resourceName;
    if (!eventMap[key]) {
      eventMap[key] = [];
    }
    eventMap[key].push(event);
  });
  const output: EventQueue_DataType[] = [];
  Object.values(eventMap).forEach((duplicatedEvents) => {
    const lastIndex = duplicatedEvents.length - 1;
    const lastEvent = duplicatedEvents[lastIndex];

    const beforeEvent: BeforeEventType = (acc, next, disableStateUpdate) => {
      duplicatedEvents.forEach((event) => {
        event.beforeEvent(acc, next, disableStateUpdate);
      });
    };

    const onSuccess: OnSuccessType = (res, acc, next, disableStateUpdate) => {
      duplicatedEvents.forEach((event) => {
        event.onSuccess(res, acc, next, disableStateUpdate);
      });
    };

    const onFailure: OnFailureType = (error, acc, next) => {
      duplicatedEvents.forEach((event) => {
        event.onFailure(error, acc, next);
      });
    };

    const onFinish: OnFinishType = (acc, next, disableStateUpdate) => {
      duplicatedEvents.forEach((event) => {
        event.onFinish(acc, next, disableStateUpdate);
      });
    };

    const fullTask = async (customConfig: AxiosRequestConfig) => {
      const index = 0;
      const totalTask = 1;
      const isFirstInChain = index === 0;
      const isLastInChain = index === totalTask - 1;
      const em_acc: AccumulatorContainer = { current: [] };

      const em_next: NextCallbackType = (data) => {
        if (data) {
          em_acc.current.push(data);
        }
        return em_acc;
      };
      try {
        beforeEvent(em_acc, em_next, !isFirstInChain);
        const res = await lastEvent.event(customConfig, em_acc, em_next);
        onSuccess(res, em_acc, em_next, !isLastInChain);
      } catch (error) {
        onFailure(error, em_acc, em_next);
      } finally {
        onFinish(em_acc, em_next, !isLastInChain);
      }
    };

    const returnValue = {
      resourceName: lastEvent.resourceName,
      beforeEvent,
      event: lastEvent.event,
      onSuccess,
      onFailure,
      onFinish,
      fullTask,
      baseConfig: lastEvent.baseConfig
    };
    output.push(returnValue);
  });
  return output;
};

export function handleEvent(events: EventQueueType) {
  const indexToRemove = 0;
  const numberToRemove = 10;
  const queueSlice = events.current.splice(indexToRemove, numberToRemove);
  const deDuplicatedEventSlice = getDeDuplicatedEventSlice(queueSlice);
  for (const event of deDuplicatedEventSlice) {
    event?.fullTask?.(event?.baseConfig || {});
  }
  return;
}
