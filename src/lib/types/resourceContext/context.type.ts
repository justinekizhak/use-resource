import { ResourceType } from "../main.type";

export type ResourceContextState = {
  [key: string]: ResourceType;
};

export type ResourceContextType = ResourceContextState | null | undefined;
