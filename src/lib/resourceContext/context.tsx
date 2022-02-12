import { createContext } from "react";
import type { GlobalResourceContextType } from "../types/resourceContext/provider.type";

export const GlobalResourceContext = createContext<
  GlobalResourceContextType<any>
>({
  dispatch: () => {
    console.info("Please add a global resource context provider.");
  },
  selector: () => {
    console.info("Please add a global resource context provider.");
    return undefined;
  }
});
