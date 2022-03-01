import { useContext } from "react";
import { GlobalResource } from "../../lib";

export default function ApiConsumer() {
  const { selector } = useContext(GlobalResource.Context);

  const stateSlice = selector("test", (data) => {
    console.log(data);
    return data.data;
  });

  return (
    <div>
      <h1>Api consumer</h1>
      {JSON.stringify(stateSlice)}
    </div>
  );
}
