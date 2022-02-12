import {
  NextType,
  BaseConfigType,
  AccumulatorContainer
} from "../types/main.type";
import { RefetchFunctionType } from "../types/refetch.type";
import type { ChainedRequestInputConfigType } from "../types/useResource.type";

import { getBaseConfig, getFinalRequestChain } from "./helpers";

export const refetchFunction: RefetchFunctionType =
  ({
    accumulator,
    defaultNext,
    beforeTask,
    task,
    onSuccess,
    onFailure,
    onFinal,
    isMessageQueueAvailable,
    messageQueueName,
    pushToMessageQueue,
    useRequestChaining,
    baseConfigRef,
    controllerInstance
  }) =>
  (customConfig: BaseConfigType = {}) => {
    const taskMaster = async (
      index = 0,
      acc: AccumulatorContainer = accumulator,
      next: NextType = defaultNext,
      _baseConfig = getBaseConfig(customConfig, index),
      _beforeTask = beforeTask,
      _task = task,
      _onSuccess = onSuccess,
      _onFailure = onFailure,
      _onFinal = onFinal,
      totalTask = 1
    ) => {
      const fullTask = async () => {
        const isFirstInChain = index === 0;
        const isLastInChain = index === totalTask - 1;
        try {
          _beforeTask(acc, next, !isFirstInChain);
          const res = await _task(_baseConfig, acc, next);
          _onSuccess(res, acc, next, !isLastInChain);
        } catch (error) {
          _onFailure(error, acc, next);
        } finally {
          _onFinal(acc, next, !isLastInChain);
        }
      };
      if (isMessageQueueAvailable) {
        pushToMessageQueue({
          key: messageQueueName,
          beforeTask: _beforeTask,
          task: _task,
          onSuccess: _onSuccess,
          onFailure: _onFailure,
          onFinal: _onFinal,
          fullTask
        });
      } else {
        await fullTask();
      }
    };
    if (!useRequestChaining) {
      accumulator.current = [];
      taskMaster();
    } else {
      const main = async () => {
        const acc: AccumulatorContainer = { current: [] };
        const next: NextType = (data: any) => {
          if (data) {
            acc.current.push(data);
          }
          return acc;
        };
        const baseConfigList =
          baseConfigRef.current as ChainedRequestInputConfigType[];
        for (let index = 0; index < baseConfigList.length; index++) {
          const requestChain = baseConfigList[index];
          const {
            baseConfig: _final_baseConfig,
            beforeTask: _final_beforeTask,
            task: _final_task,
            onSuccess: _final_onSuccess,
            onFailure: _final_onFailure,
            onFinal: _final_onFinal
          } = getFinalRequestChain(
            requestChain,
            index,
            baseConfigList,
            beforeTask,
            task,
            onSuccess,
            onFailure,
            onFinal,
            controllerInstance
          );
          const totalTask = baseConfigList.length;
          await taskMaster(
            index,
            acc,
            next,
            _final_baseConfig,
            _final_beforeTask,
            _final_task,
            _final_onSuccess,
            _final_onFailure,
            _final_onFinal,
            totalTask
          );
        }
      };
      main();
    }
  };
