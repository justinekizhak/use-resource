import { useRenderCount } from "../utils/useRenderCount";
import { useSelector } from "../../lib";

export default function ApiConsumer() {
  const { RenderContainer } = useRenderCount();

  const data = useSelector("test", "data");
  const isLoading = useSelector("test", "isLoading");

  return (
    <div>
      <h1>Api consumer</h1>
      <RenderContainer />
      {`Loading: ${isLoading}`}
      {JSON.stringify(data)}
    </div>
  );
}
