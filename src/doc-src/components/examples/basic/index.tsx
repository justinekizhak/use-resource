import { useResource } from "../lib-imports";
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
        <div className="bg-red-500">Content: {JSON.stringify(data)}</div>
      </Container>
    </div>
  );
}
