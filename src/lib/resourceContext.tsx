import { createContext } from "react";
import { GlobalResourceContextType } from "./interfaces";

export const GlobalResourceContext = createContext<GlobalResourceContextType>({
  dispatch: () => {
    console.info("Please add a global resource context provider.");
  },
  selector: () => {
    console.info("Please add a global resource context provider.");
  }
});
