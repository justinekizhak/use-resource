import type {
  NextCallbackType,
  AccumulatorContainer
} from "../types/main.type";
import type { RequestChainHandlerType } from "../types/refetch.type";
import type { ChainedRequestConfigType } from "../types/useResource.type";
import { createDependencyMap } from "./dependencyMap";
import { getFinalRequestChain } from "../utils/helpers";

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

function getIsDepsResolved(
  allResolvedDeps: string[],
  currentDeps: string[] | null | undefined
) {
  if (currentDeps === null || currentDeps === undefined) {
    return true;
  }
  for (const dep of currentDeps) {
    if (!allResolvedDeps.includes(dep)) {
      return false;
    }
  }
  return true;
}

function getName(request: ChainedRequestConfigType, index = 0) {
  return request?.dependencyName || `${index}`;
}

function getAllName(requestChain: ChainedRequestConfigType[]): string[] {
  const output = requestChain.map((request, index) => {
    return getName(request, index);
  });
  return output;
}

interface RequestMap {
  [key: string]: ChainedRequestConfigType;
}

function getRequestMap(requestChain: ChainedRequestConfigType[]): RequestMap {
  const output: RequestMap = {};
  requestChain.forEach((request, index) => {
    const name = getName(request, index);
    output[name] = request;
  });
  return output;
}

async function dummyApi(requestName: string) {
  const p = new Promise((resolve) =>
    setTimeout(() => {
      console.log(requestName);
      resolve(requestName);
    }, 1000)
  );
  await p;
}

function removeItemAll(arr: string[], value: string) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

async function execute(requestChain: ChainedRequestConfigType[]) {
  const requestMap = getRequestMap(requestChain);

  const backlog: string[] = getAllName(requestChain);
  const done: string[] = [];

  let keepRunning = true;

  while (keepRunning) {
    const promises = [];
    const inProgress: string[] = [];
    for (const requestName of [...backlog]) {
      const request = requestMap[requestName];
      const isDepsResolved = getIsDepsResolved(done, request?.dependencyList);
      if (isDepsResolved) {
        inProgress.push(requestName);
        removeItemAll(backlog, requestName);
        const p = dummyApi(requestName);
        promises.push(p);
      }
    }
    await Promise.all(promises);
    done.push(...inProgress);
    if (backlog.length === 0) {
      keepRunning = false;
    }
  }
}
