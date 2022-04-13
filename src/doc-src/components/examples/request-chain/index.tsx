import { BaseConfig_T, useResource } from "../lib-imports";
import { useRenderCount } from "../utils/useRenderCount";

export default function App() {
  const { RenderContainer } = useRenderCount();
  const config: BaseConfig_T = [
    {
      baseConfig: {
        url: `https://jsonplaceholder.typicode.com/todos/1`
      }
    },
    {
      baseConfig: {
        url: `https://jsonplaceholder.typicode.com/todos/2`
      }
    }
  ];

  const { data, Container, refetch } = useResource(config, "todoDetails");

  return (
    <div className="App component">
      <RenderContainer />
      <Container hideWhenLoading>
        <div className="px-3 py-2 font-mono bg-gray-300">
          Content: {JSON.stringify(data)}
        </div>
        <button onClick={() => refetch()} className="mt-2 btn btn-primary">
          Refetch data
        </button>
      </Container>
    </div>
  );
}
