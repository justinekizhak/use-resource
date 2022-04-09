import type { Resource_T } from "../main.type";

export type ResourceContextState<T> = {
  [key: string]: Resource_T<T>;
};

export type ResourceContext_T<T> = ResourceContextState<T> | null | undefined;
