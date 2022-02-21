import type { ChainedRequestConfigType } from "../types/useResource.type";
import { getName } from "../utils/requestChain";

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

async function dummyApi(
  requestConfig: ChainedRequestConfigType,
  index: number
) {
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

interface RequestIndexMapType {
  [key: string]: number;
}

function getRequestIndexMap(
  requestChain: ChainedRequestConfigType[]
): RequestIndexMapType {
  const map: RequestIndexMapType = {};
  requestChain.forEach((request, index) => {
    const name = getName(request);
    map[name] = index;
  });
  return map;
}

export async function execute(
  requestChain: ChainedRequestConfigType[],
  apiHandler = dummyApi
) {
  const requestMap = getRequestMap(requestChain);
  const requestIndexMap = getRequestIndexMap(requestChain);

  const backlog: string[] = getAllName(requestChain);
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
