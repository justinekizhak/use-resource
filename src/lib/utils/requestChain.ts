import type { ChainedRequestConfigType } from "../types/useResource.type";

export function getName(request: ChainedRequestConfigType, index = 0) {
  return request?.requestName || `${index}`;
}
