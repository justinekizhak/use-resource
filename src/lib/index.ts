import { GlobalResourceContext } from "./resourceContext/context";
import { GlobalResourceContextProvider } from "./resourceContext/provider";

export { useResource } from "./useResource";

export const GlobalResource = {
  Context: GlobalResourceContext,
  Provider: GlobalResourceContextProvider
};

export {
  useSelector,
  useDispatch,
  usePublish
} from "lib/resourceContext/hooks";
