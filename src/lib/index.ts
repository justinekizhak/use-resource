import { GlobalResourceContext } from "./resourceContext/context";
import { GlobalResourceContextProvider } from "./resourceContext/provider";

export * from "./types/main.type";
export * from "./types/helpers.type";
export * from "./types/refetch.type";
export * from "./types/useResource.type";
export * from "./types/resourceContext/context.type";
export * from "./types/resourceContext/provider.type";

export { useResource } from "./useResource";

export const GlobalResource = {
  Context: GlobalResourceContext,
  Provider: GlobalResourceContextProvider
};

export { useSelector, useDispatch, usePublish } from "./resourceContext/hooks";
