import type { ChainedRequestConfigType } from "../types/useResource.type";

export function getName(request: ChainedRequestConfigType, index = 0) {
  return request?.requestName || `${index}`;
}

export function getAllDependencyName(
  requestChain: ChainedRequestConfigType[]
): string[] {
  const output = requestChain.map((request, index) => {
    return getName(request, index);
  });
  return output;
}
