import { DependencyMapType } from "../types/requestChain/dependencyMap.type";
import type { ChainedRequestConfigType } from "../types/useResource.type";

export const createDependencyMap = (
  requestChain: ChainedRequestConfigType[]
): [DependencyMapType, string] => {
  const map: DependencyMapType = {};
  let start: string = "";
  let previousDep: string | null = null;
  requestChain.forEach((request, index) => {
    const dependencyName: string = request?.dependencyName || `${index}`;
    let dependencyList: string[] | null | undefined = request?.dependencyList;
    if (!dependencyList && previousDep) {
      dependencyList = [previousDep];
    }
    request.dependencyName = dependencyName;
    map[dependencyName] = dependencyList || null;
    previousDep = dependencyName;
    if (!start) {
      start = dependencyName;
    }
  });
  return [map, start];
};
