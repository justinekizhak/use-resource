import { render } from "react-dom";
import { GlobalResourceContextProvider } from "./lib/resourceContextProvider";
import App from "./App";

const FullApp = () => {
  return (
    <GlobalResourceContextProvider>
      <App />
    </GlobalResourceContextProvider>
  );
};

const rootElement = document.getElementById("root");
render(<FullApp />, rootElement);
