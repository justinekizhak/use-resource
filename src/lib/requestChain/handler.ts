import type {
  NextCallbackType,
  AccumulatorContainer
} from "../types/main.type";
import type { RequestChainHandlerType } from "../types/refetch.type";
import type { ChainedRequestConfigType } from "../types/useResource.type";
import { getFinalRequestChain } from "../utils/helpers";
import { execute } from "./parallelApiHandler";

export const requestChainHandler: RequestChainHandlerType = ({
  baseConfigRef,
  internal_beforeEvent,
  internal_event,
  internal_onSuccess,
  internal_onFailure,
  internal_onFinish,
  controllerInstance,
  eventMaster
}) => async () => {
  const cr_acc: AccumulatorContainer = { current: [] };
  const cr_next: NextCallbackType = (data: any) => {
    if (data) {
      cr_acc.current.push(data);
    }
    return cr_acc;
  };
  const baseConfigList = baseConfigRef.current as ChainedRequestConfigType[];
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
