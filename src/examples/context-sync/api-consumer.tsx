import { useContext, useState } from "react";
import { GlobalResource } from "../../lib";
import { useRenderCount } from "../utils/useRenderCount";

export default function ApiConsumer() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { selector } = useContext(GlobalResource.Context);
  const { RenderContainer } = useRenderCount();

  /**
   * Recommended way
   */
  // selector("test", "data", setData);

  /**
   * Even better than the Recommended way
   * This will check if the data in the component is same.
   * If so then it won't even trigger a re-render.
   */
  selector("test", "data", setData, data);
  // selector("test", "isLoading", setIsLoading, isLoading);

  /**
   * You can use the callback way to console.log or debug.
   * Please note that this callback will not cause any re-render and the component
   * will not update.
   */
  // selector("test", (value) => {
  //   console.log("selector: ", value);
  // });

  return (
    <div>
      <h1>Api consumer</h1>
      <RenderContainer />
      {`${isLoading}`}
      {JSON.stringify(data)}
    </div>
  );
}
