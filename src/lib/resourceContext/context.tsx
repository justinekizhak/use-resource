import { createContext } from "react";
import type { GlobalResourceContextType } from "../types/resourceContext/provider.type";

export const globalResourceContextDefault = {
  state: { current: {} },
  stateCallbacks: { current: {} },
  eventQueue: { current: [] }
};

export const GlobalResourceContext = createContext<
  GlobalResourceContextType<any>
>(globalResourceContextDefault);
