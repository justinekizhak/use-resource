import { render } from "react-dom";
import { GlobalResource } from "./lib/index";
import App from "./App";

const FullApp = () => {
  return (
    <GlobalResource.Provider>
      <App />
    </GlobalResource.Provider>
  );
};

const rootElement = document.getElementById("root");
render(<FullApp />, rootElement);
