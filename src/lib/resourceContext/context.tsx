import { createContext } from "react";
import type { GlobalResourceContext_T } from "../types/resourceContext/provider.type";

/**
 * Create and return the initial value for the global resource context.
 *
 * We can create as many `resource-context` as we want, but we need to
 * make sure all their initial values have the same schema.
 * This function will generate a initial value for the context.
 *
 * The use of this function is optional, but it is recommended to use it.
 * As long as the object schema is the same, the `resourceContext` will work.
 *
 * @param state Initial global resource context state.
 * @param stateCallbacks Initial state callbacks.
 * @param eventQueue Initial event queue.
 * @returns An object which is used as the default value for the global resource context.
 */
export function generateContextDefault<T = any>(
  state = {},
  stateCallbacks = {},
  eventQueue = []
): GlobalResourceContext_T<T> {
  return {
    state: { current: state },
    stateCallbacks: { current: stateCallbacks },
    eventQueue: { current: eventQueue }
  };
}

export const GlobalResourceContext = createContext(generateContextDefault());
