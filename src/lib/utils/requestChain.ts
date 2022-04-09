import type { ChainedRequestConfig_T } from "../types/useResource.type";

export function getName(request: ChainedRequestConfig_T, index = 0) {
  return request?.requestName || `${index}`;
}

export function getAllDependencyName(
  requestChain: ChainedRequestConfig_T[]
): string[] {
  const output = requestChain.map((request, index) => {
    return getName(request, index);
  });
  return output;
}
