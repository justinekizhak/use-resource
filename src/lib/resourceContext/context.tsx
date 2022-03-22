import { createContext } from "react";
import type { GlobalResourceContextType } from "../types/resourceContext/provider.type";

export function generateContextDefault<T = any>(
  state = {},
  stateCallbacks = {},
  eventQueue = []
): GlobalResourceContextType<T> {
  return {
    state: { current: state },
    stateCallbacks: { current: stateCallbacks },
    eventQueue: { current: eventQueue }
  };
}

export const GlobalResourceContext = createContext(generateContextDefault());
