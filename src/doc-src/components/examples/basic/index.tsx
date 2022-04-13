import { useResource } from "../lib-imports";
import { useRenderCount } from "../utils/useRenderCount";

export default function App() {
  const { RenderContainer } = useRenderCount();
  const config = {
    url: `https://jsonplaceholder.typicode.com/todos/1`
  };

  const { data, Container } = useResource(config, "todoDetails");

  return (
    <div className="App component">
      <RenderContainer />
      <Container hideWhenLoading>
        <div className="px-3 py-2 font-mono bg-gray-300">
          Content: {JSON.stringify(data)}
        </div>
      </Container>
    </div>
  );
}
