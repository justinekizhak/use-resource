import { createContext } from "react";
import { GlobalResourceContextType } from "./interfaces";

export const GlobalResourceContext = createContext<GlobalResourceContextType>({
  dispatch: () => {},
  selector: () => {}
});
