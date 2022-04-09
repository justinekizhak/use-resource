import type { BaseConfig_T } from "../types/main.type";
import type {
  EventMasterFunc_T,
  RefetchFunction_T
} from "../types/refetch.type";

import { getBaseConfig } from "./helpers";
import { requestChainHandler } from "../requestChain/handler";

export const refetchFunction: RefetchFunction_T =
  ({
    accumulator: internal_accumulator,
    defaultNext: internal_defaultNext,
    beforeEvent: internal_beforeEvent,
    event: internal_event,
    onSuccess: internal_onSuccess,
    onFailure: internal_onFailure,
    onFinish: internal_onFinish,
    isMessageQueueAvailable,
    pushToMessageQueue,
    useRequestChaining,
    baseConfigRef,
    controllerInstance,
    resourceName
  }) =>
  (customConfig: BaseConfig_T = {}) => {
    const eventMaster: EventMasterFunc_T = async (
      index = 0,
      em_acc = internal_accumulator,
      em_next = internal_defaultNext,
      em_baseConfig = getBaseConfig(customConfig, index),
      em_beforeEvent = internal_beforeEvent,
      em_event = internal_event,
      em_onSuccess = internal_onSuccess,
      em_onFailure = internal_onFailure,
      em_onFinish = internal_onFinish,
      totalTask = 1
    ) => {
      const fullTask = async () => {
        const isFirstInChain = index === 0;
        const isLastInChain = index === totalTask - 1;
        try {
          em_beforeEvent(em_acc, em_next, !isFirstInChain);
          const finalConfig = getBaseConfig(customConfig, index);
          const res = await em_event(finalConfig, em_acc, em_next);
          em_onSuccess(res, em_acc, em_next, !isLastInChain);
        } catch (error) {
          em_onFailure(error, em_acc, em_next);
        } finally {
          em_onFinish(em_acc, em_next, !isLastInChain);
        }
      };
      if (isMessageQueueAvailable) {
        pushToMessageQueue({
          resourceName,
          beforeEvent: em_beforeEvent,
          event: em_event,
          onSuccess: em_onSuccess,
          onFailure: em_onFailure,
          onFinish: em_onFinish,
          fullTask,
          baseConfig: em_baseConfig
        });
      } else {
        await fullTask();
      }
    };
    if (!useRequestChaining) {
      internal_accumulator.current = [];
      eventMaster();
    } else {
      const main = requestChainHandler({
        baseConfigRef,
        internal_beforeEvent,
        internal_event,
        internal_onSuccess,
        internal_onFailure,
        internal_onFinish,
        controllerInstance,
        eventMaster
      });
      main();
    }
  };
