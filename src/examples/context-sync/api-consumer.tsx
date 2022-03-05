import { useRenderCount } from "../utils/useRenderCount";
import { useSelector } from "../../lib";

export default function ApiConsumer() {
  const { RenderContainer } = useRenderCount();

  /**
   * If you need only few fields then use the key along with the resourceName in the selector,
   * Each selector will cause a re-render of the component
   */
  // const data = useSelector("test", "data");
  // const isLoading = useSelector("test", "isLoading");
  // const isFetching = useSelector("test", "isFetching");

  /**
   * If you need to access the entire resource then use the just pass the only the resourceName in the selector,
   * It will return the entire resource object which you can use as you want.
   * The number of re-render will be exactly the same as the re-renders in the invoker component
   */
  const fullData = useSelector("test") || {};

  return (
    <div>
      <h1>Api consumer</h1>
      <RenderContainer />
      {/* {`Loading: ${isLoading}`}
      {`Fetching: ${isFetching}`}
      {JSON.stringify(data)} */}
      {JSON.stringify(fullData?.data)}
      {fullData?.isLoading + " "}
      {fullData?.isFetching + " "}
    </div>
  );
}
