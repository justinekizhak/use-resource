import { useResource } from "../../lib";
import { useRenderCount } from "../utils/useRenderCount";

export default function App() {
  const { RenderContainer } = useRenderCount();
  const config = {
    url: `https://jsonplaceholder.typicode.com/todos/1`
  };

  const { data, Container } = useResource(config, "todoDetails");

  return (
    <div className="App">
      <RenderContainer />
      <Container>
        <div>Content: {JSON.stringify(data)}</div>
      </Container>
    </div>
  );
}
