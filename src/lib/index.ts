import { GlobalResourceContext } from "./resourceContext/context";
import { GlobalResourceContextProvider } from "./resourceContext/provider";

export { useResource } from "./useResource";
export * from "./types/index.type";

export const GlobalResource = {
  Context: GlobalResourceContext,
  Provider: GlobalResourceContextProvider
};
