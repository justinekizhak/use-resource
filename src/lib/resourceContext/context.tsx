import { createContext } from "react";
import type { GlobalResourceContextType } from "../types/resourceContext/provider.type";

export const globalResourceContextDefault = {
  dispatch: () => {
    console.info("Please add a global resource context provider.");
  },
  selector: () => {
    console.info("Please add a global resource context provider.");
    return undefined;
  }
};

export const GlobalResourceContext = createContext<
  GlobalResourceContextType<any>
>(globalResourceContextDefault);
