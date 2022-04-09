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

export const GlobalResource = {
  Context: GlobalResourceContext,
  Provider: GlobalResourceContextProvider
};

export { generateContextDefault };

export { useSelector, useDispatch, usePublish } from "./resourceContext/hooks";
