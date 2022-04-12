import type { BaseConfig_T } from "../types/main.type";
import type {
  EventMasterFunc_T,
  RefetchFunction_T
} from "../types/refetch.type";

import { getBaseConfig } from "./helpers";
import { requestChainHandler } from "../requestChain/handler";
import { resetAcc } from "./defaultValues";

/**
 * This function is a generator function which will generate and return the refetch function.
 *
 * It will handle all the logic for single or chained request. Also if we are using the message queue or not.
 *
 * For the handling of the local state update vs the global resource context update, those are handled within the
 * events themselves.
 *
 * @param args
 * @returns
 */
export const refetchFunction: RefetchFunction_T =
  ({
    accumulator: internal_accumulator,
    defaultPushToAcc: internal_defaultNext,
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
    /**
     * Event master function contains the logic for a single request.
     *
     * If we have a chained request then it is handled by the `requestChainHandler` function.
     *
     * So before we run this we need to check if the request is a single or a chained request.
     *
     * If it is a chained request then we will pass in the `eventMaster` to the `requestChainHandler` function.
     *
     * The `requestChainHandler` function will execute all the requests using the `eventMaster` function itself.
     *
     * Obviously, the dependent request will be resolved before running the eventMaster.
     *
     * @param index
     * @param em_acc
     * @param em_next
     * @param em_baseConfig
     * @param em_beforeEvent
     * @param em_event
     * @param em_onSuccess
     * @param em_onFailure
     * @param em_onFinish
     * @param totalTask
     */
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
        resetAcc(em_acc);
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
      resetAcc(internal_accumulator);
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
