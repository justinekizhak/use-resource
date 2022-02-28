import { GlobalResource } from "../../lib";
import ApiInvoker from "./api-invoker";
import ApiConsumer from "./api-consumer";

export default function ContextExample() {
  return (
    <GlobalResource.Provider>
      <ApiInvoker />
      <ApiConsumer />
    </GlobalResource.Provider>
  );
}
