/**
 * Only the functions and hooks exported here are available to be used public.
 *
 * Rest all are under the {@link Internals} module.
 *
 * For type information, see {@link Types} module.
 *
 * @module Externals
 */

import {
  GlobalResourceContext,
  generateContextDefault
} from "./resourceContext/context";
import { GlobalResourceContextProvider } from "./resourceContext/provider";

export { useResource } from "./useResource";

/**
 * GlobalResource object.
 *
 * Use this object when you want to add the global-resource-provider or use its corresponding context.
 *
 * You can also create your own global-resource context and use it.
 *
 * For creating your own global-resource context, see {@link generateContextDefault}.
 */
export const GlobalResource = {
  Context: GlobalResourceContext,
  Provider: GlobalResourceContextProvider
};

export { generateContextDefault };

export { useSelector, useDispatch, usePublish } from "./resourceContext/hooks";
