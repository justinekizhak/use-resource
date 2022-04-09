import { AxiosRequestConfig } from "axios";
import type { AccumulatorContainer, NextCallback_T } from "../types";
import type {
  EventQueue_T,
  EventQueue_AccumulatorContainer,
  EventQueue_BeforeEvent_T,
  EventQueue_Data_T,
  EventQueue_DeDup_Data_T,
  EventQueue_NextCallback_T,
  EventQueue_OnFailure_T,
  EventQueue_OnFinish_T,
  EventQueue_OnSuccess_T
} from "../types/resourceContext/eventQueue.type";

const getDeDuplicatedEventSlice = (queueSlice: EventQueue_Data_T[]) => {
  const eventMap: {
    [key: string]: EventQueue_Data_T[];
  } = {};
  queueSlice?.forEach((event) => {
    const key = event.resourceName;
    if (!eventMap[key]) {
      eventMap[key] = [];
    }
    eventMap[key].push(event);
  });
  const output: EventQueue_DeDup_Data_T[] = [];
  Object.values(eventMap).forEach((duplicatedEvents, index) => {
    const lastIndex = duplicatedEvents.length - 1;
    const lastEvent = duplicatedEvents[lastIndex];

    const beforeEvent: EventQueue_BeforeEvent_T = (
      accList,
      nextList,
      disableStateUpdate
    ) => {
      duplicatedEvents.forEach((event) => {
        const acc: AccumulatorContainer = (accList && accList[index]) || {
          current: []
        };
        const next: NextCallback_T =
          (nextList && nextList(index)) || (() => ({ current: [] }));
        event.beforeEvent(acc, next, disableStateUpdate);
      });
    };

    const onSuccess: EventQueue_OnSuccess_T = (
      res,
      accList,
      nextList,
      disableStateUpdate
    ) => {
      duplicatedEvents.forEach((event) => {
        const acc: AccumulatorContainer = (accList && accList[index]) || {
          current: []
        };
        const next: NextCallback_T =
          (nextList && nextList(index)) || (() => ({ current: [] }));
        event.onSuccess(res, acc, next, disableStateUpdate);
      });
    };

    const onFailure: EventQueue_OnFailure_T = (error, accList, nextList) => {
      duplicatedEvents.forEach((event) => {
        const acc: AccumulatorContainer = (accList && accList[index]) || {
          current: []
        };
        const next: NextCallback_T =
          (nextList && nextList(index)) || (() => ({ current: [] }));
        event.onFailure(error, acc, next);
      });
    };

    const onFinish: EventQueue_OnFinish_T = (
      accList,
      nextList,
      disableStateUpdate
    ) => {
      duplicatedEvents.forEach((event) => {
        const acc: AccumulatorContainer = (accList && accList[index]) || {
          current: []
        };
        const next: NextCallback_T =
          (nextList && nextList(index)) || (() => ({ current: [] }));
        event.onFinish(acc, next, disableStateUpdate);
      });
    };

    const fullTask = async (customConfig: AxiosRequestConfig) => {
      const index = 0;
      const totalTask = 1;
      const lastIndex = totalTask - 1;
      const isFirstInChain = index === 0;
      const isLastInChain = index === totalTask - 1;
      const accList: EventQueue_AccumulatorContainer = [{ current: [] }];

      const nextList: EventQueue_NextCallback_T = (index: number) => {
        const callback: NextCallback_T = (data) => {
          if (data) {
            accList[index].current.push(data);
          }
          return accList[index];
        };
        return callback;
      };
      try {
        beforeEvent(accList, nextList, !isFirstInChain);
        const res = await lastEvent.event(
          customConfig,
          accList[lastIndex],
          nextList(lastIndex)
        );
        onSuccess(res, accList, nextList, !isLastInChain);
      } catch (error) {
        onFailure(error, accList, nextList);
      } finally {
        onFinish(accList, nextList, !isLastInChain);
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

export function handleEvent(events: EventQueue_T) {
  const indexToRemove = 0;
  const numberToRemove = 10;
  const queueSlice = events.current.splice(indexToRemove, numberToRemove);
  const deDuplicatedEventSlice = getDeDuplicatedEventSlice(queueSlice);
  for (const event of deDuplicatedEventSlice) {
    event?.fullTask?.(event?.baseConfig || {});
  }
  return;
}
