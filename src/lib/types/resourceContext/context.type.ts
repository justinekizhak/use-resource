import type { Resource_T } from "../main.type";

export type ResourceContextState_T<T> = {
  [key: string]: Resource_T<T>;
};

export type ResourceContext_T<T> = ResourceContextState_T<T> | null | undefined;
