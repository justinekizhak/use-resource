import { ResourceType } from "../main.type";

export type ResourceContextState<T> = {
  [key: string]: ResourceType<T>;
};

export type ResourceContextType<T> = ResourceContextState<T> | null | undefined;
