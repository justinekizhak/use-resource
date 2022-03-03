import { EventQueueType } from "lib/types/resourceContext/provider.type";

export function handleEvent(events: EventQueueType) {
  const indexToRemove = 0;
  const numberToRemove = 10;
  const queueSlice = events.current.splice(indexToRemove, numberToRemove);
  console.log("handle events: ", queueSlice);
  return;
}
