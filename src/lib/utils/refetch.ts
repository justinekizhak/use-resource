import type {
  NextCallbackType,
  BaseConfigType,
  AccumulatorContainer
} from "../types/main.type";
import type { RefetchFunctionType } from "../types/refetch.type";
import type { ChainedRequestConfigType } from "../types/useResource.type";

import { getBaseConfig, getFinalRequestChain } from "./helpers";

export const refetchFunction: RefetchFunctionType =
  ({
    accumulator: internal_accumulator,
    defaultNext: internal_defaultNext,
    beforeEvent: internal_beforeEvent,
    event: internal_event,
    onSuccess: internal_onSuccess,
    onFailure: internal_onFailure,
    onFinish: internal_onFinish,
    isMessageQueueAvailable,
    messageQueueName,
    pushToMessageQueue,
    useRequestChaining,
    baseConfigRef,
    controllerInstance
  }) =>
  (customConfig: BaseConfigType = {}) => {
    const eventMaster = async (
      index = 0,
      em_acc: AccumulatorContainer = internal_accumulator,
      em_next: NextCallbackType = internal_defaultNext,
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
          const res = await em_event(em_baseConfig, em_acc, em_next);
          em_onSuccess(res, em_acc, em_next, !isLastInChain);
        } catch (error) {
          em_onFailure(error, em_acc, em_next);
        } finally {
          em_onFinish(em_acc, em_next, !isLastInChain);
        }
      };
      if (isMessageQueueAvailable) {
        pushToMessageQueue({
          key: messageQueueName,
          beforeEvent: em_beforeEvent,
          event: em_event,
          onSuccess: em_onSuccess,
          onFailure: em_onFailure,
          onFinish: em_onFinish,
          fullTask
        });
      } else {
        await fullTask();
      }
    };
    if (!useRequestChaining) {
      internal_accumulator.current = [];
      eventMaster();
    } else {
      const main = async () => {
        const cr_acc: AccumulatorContainer = { current: [] };
        const cr_next: NextCallbackType = (data: any) => {
          if (data) {
            cr_acc.current.push(data);
          }
          return cr_acc;
        };
        const baseConfigList =
          baseConfigRef.current as ChainedRequestConfigType[];
        for (let index = 0; index < baseConfigList.length; index++) {
          const requestChain = baseConfigList[index];
          const {
            baseConfig: cr_baseConfig,
            beforeEvent: cr_beforeEvent,
            event: cr_event,
            onSuccess: cr_onSuccess,
            onFailure: cr_onFailure,
            onFinish: cr_onFinish
          } = getFinalRequestChain(
            requestChain,
            index,
            baseConfigList,
            internal_beforeEvent,
            internal_event,
            internal_onSuccess,
            internal_onFailure,
            internal_onFinish,
            controllerInstance
          );
          const totalTask = baseConfigList.length;
          await eventMaster(
            index,
            cr_acc,
            cr_next,
            cr_baseConfig,
            cr_beforeEvent,
            cr_event,
            cr_onSuccess,
            cr_onFailure,
            cr_onFinish,
            totalTask
          );
        }
      };
      main();
    }
  };
