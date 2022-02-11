import { ResourceType } from "../index.type";

export type ResourceContextState = {
  [key: string]: ResourceType;
};

export type ResourceContextType = ResourceContextState | null | undefined;
