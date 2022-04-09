import type { NextCallback_T, AccumulatorContainer } from "../types/main.type";
import type { RequestChainHandler_T } from "../types/refetch.type";
import type { ChainedRequestConfig_T } from "../types/useResource.type";
import { getFinalRequestChain } from "../utils/helpers";
import { execute } from "./parallelApiHandler";

export const requestChainHandler: RequestChainHandler_T =
  ({
    baseConfigRef,
    internal_beforeEvent,
    internal_event,
    internal_onSuccess,
    internal_onFailure,
    internal_onFinish,
    controllerInstance,
    eventMaster
  }) =>
  async () => {
    const cr_acc: AccumulatorContainer = { current: [] };
    const cr_next: NextCallback_T = (data: any) => {
      if (data) {
        cr_acc.current.push(data);
      }
      return cr_acc;
    };
    // @ts-ignore
    const baseConfigList: ChainedRequestConfig_T[] = baseConfigRef.current;
    await execute(baseConfigList, async (requestConfig, index) => {
      const {
        baseConfig: cr_baseConfig,
        beforeEvent: cr_beforeEvent,
        event: cr_event,
        onSuccess: cr_onSuccess,
        onFailure: cr_onFailure,
        onFinish: cr_onFinish
      } = getFinalRequestChain(
        requestConfig,
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
    });
  };
