import { GlobalResource } from "../../lib";
import EventProducer from "./event-producer";

export default function App() {
  return (
    <GlobalResource.Provider>
      <EventProducer />
    </GlobalResource.Provider>
  );
}
