import { useRenderCount } from "../utils/useRenderCount";
import { Resource_T, useSelector } from "../lib-imports";

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
  const fullData: Resource_T<any> = useSelector("test") || {};

  return (
    <div>
      <h1 className="display-6">API consumer</h1>
      <RenderContainer />
      <div className="px-3 py-2 font-mono bg-gray-300">
        {JSON.stringify(fullData?.data)}
      </div>
    </div>
  );
}
