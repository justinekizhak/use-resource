import type { ChainedRequestConfig_T } from "../types/useResource.type";
import { getName } from "../utils/requestChain";
import { getAllDependencyName } from "../utils/requestChain";
import type { RequestIndexMap_T } from "../types/requestChain/dependencyMap.type";

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

interface RequestMap {
  [key: string]: ChainedRequestConfig_T;
}

function getRequestMap(requestChain: ChainedRequestConfig_T[]): RequestMap {
  const output: RequestMap = {};
  requestChain.forEach((request, index) => {
    const name = getName(request, index);
    output[name] = request;
  });
  return output;
}

async function dummyApi(requestConfig: ChainedRequestConfig_T, index: number) {
  const p = new Promise((resolve) =>
    setTimeout(() => {
      console.log("test: ", requestConfig.requestName);
      resolve(index);
    }, 1000)
  );
  return await p;
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

function getRequestIndexMap(
  requestChain: ChainedRequestConfig_T[]
): RequestIndexMap_T {
  const map: RequestIndexMap_T = {};
  requestChain.forEach((request, index) => {
    const name = getName(request, index);
    map[name] = index;
  });
  return map;
}

export async function execute(
  requestChain: ChainedRequestConfig_T[],
  apiHandler = dummyApi
) {
  const requestMap = getRequestMap(requestChain);
  const requestIndexMap = getRequestIndexMap(requestChain);

  const backlog: string[] = getAllDependencyName(requestChain);
  const done: string[] = [];

  let keepRunning = true;

  while (keepRunning) {
    const promises: any[] = [];
    const inProgress: string[] = [];
    [...backlog].forEach((requestName) => {
      const index = requestIndexMap[requestName];
      const request = requestMap[requestName];
      const isDepsResolved = getIsDepsResolved(done, request?.dependencyList);
      if (isDepsResolved) {
        inProgress.push(requestName);
        removeItemAll(backlog, requestName);
        const p = apiHandler(request, index);
        promises.push(p);
      }
    });
    await Promise.all(promises);
    done.push(...inProgress);
    if (backlog.length === 0) {
      keepRunning = false;
    }
  }
}
