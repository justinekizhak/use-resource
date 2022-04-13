import { AxiosRequestConfig } from "axios";
import {
  generateDefaultAccContainer,
  generateDefaultPushToAcc
} from "lib/utils/defaultValues";
import type { AccumulatorContainer_T, PushToAcc_T } from "../types";
import type {
  EventQueue_T,
  EventQueue_AccumulatorContainer_T,
  EventQueue_BeforeEvent_T,
  EventQueue_Data_T,
  EventQueue_DeDup_Data_T,
  EventQueue_PushToAcc_T,
  EventQueue_OnFailure_T,
  EventQueue_OnFinish_T,
  EventQueue_OnSuccess_T
} from "../types/resourceContext/eventQueue.type";

/**
 * This function will merge all the events with the same resource name into a single
 * event. And the new merged event will update all corresponding states.
 *
 * @param queueSlice Array of events to be processed
 * @returns
 */
const getDeDuplicatedEventSlice = (queueSlice: EventQueue_Data_T[]) => {
  // Defining an event map object for merging events
  const eventMap: {
    [key: string]: EventQueue_Data_T[];
  } = {};
  // Grouping logic. First we group all the events by their resource name.
  queueSlice?.forEach((event) => {
    const key = event.resourceName;
    if (!eventMap[key]) {
      eventMap[key] = [];
    }
    eventMap[key].push(event);
  });

  // Now we will do the merge for all the grouped events.
  const output: EventQueue_DeDup_Data_T[] = [];
  Object.values(eventMap).forEach((duplicatedEvents, index) => {
    const lastIndex = duplicatedEvents.length - 1;
    const lastEvent = duplicatedEvents[lastIndex];

    const beforeEvent: EventQueue_BeforeEvent_T = (
      accContainer,
      pushToAcc,
      disableStateUpdate
    ) => {
      duplicatedEvents.forEach((event) => {
        const acc: AccumulatorContainer_T =
          accContainer[index] || generateDefaultAccContainer();
        const _push: PushToAcc_T = pushToAcc(index);
        event.beforeEvent(acc, _push, disableStateUpdate);
      });
    };

    const onSuccess: EventQueue_OnSuccess_T = (
      res,
      accContainer,
      pushToAcc,
      disableStateUpdate
    ) => {
      duplicatedEvents.forEach((event) => {
        const acc: AccumulatorContainer_T =
          accContainer[index] || generateDefaultAccContainer();
        const _push: PushToAcc_T = pushToAcc(index);
        event.onSuccess(res, acc, _push, disableStateUpdate);
      });
    };

    const onFailure: EventQueue_OnFailure_T = (
      error,
      accContainer,
      pushToAcc
    ) => {
      duplicatedEvents.forEach((event) => {
        const acc: AccumulatorContainer_T =
          accContainer[index] || generateDefaultAccContainer();
        const _push: PushToAcc_T = pushToAcc(index);
        event.onFailure(error, acc, _push);
      });
    };

    const onFinish: EventQueue_OnFinish_T = (
      accContainer,
      pushToAcc,
      disableStateUpdate
    ) => {
      duplicatedEvents.forEach((event) => {
        const acc: AccumulatorContainer_T =
          accContainer[index] || generateDefaultAccContainer();
        const _push: PushToAcc_T = pushToAcc(index);
        event.onFinish(acc, _push, disableStateUpdate);
      });
    };

    const fullTask = async (customConfig: AxiosRequestConfig) => {
      const index = 0;
      const totalTask = 1;
      const lastIndex = totalTask - 1;
      const isFirstInChain = index === 0;
      const isLastInChain = index === totalTask - 1;
      const acc: EventQueue_AccumulatorContainer_T = [
        generateDefaultAccContainer()
      ];

      const pushToAcc: EventQueue_PushToAcc_T = (index: number) => {
        const callback = generateDefaultPushToAcc(acc[index]);
        return callback;
      };
      try {
        beforeEvent(acc, pushToAcc, !isFirstInChain);
        const res = await lastEvent.event(
          customConfig,
          acc[lastIndex],
          pushToAcc(lastIndex)
        );
        onSuccess(res, acc, pushToAcc, !isLastInChain);
      } catch (error) {
        onFailure(error, acc, pushToAcc);
      } finally {
        onFinish(acc, pushToAcc, !isLastInChain);
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
