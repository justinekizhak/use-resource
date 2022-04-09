import { useResource } from "../lib-imports";
import { useRenderCount } from "../utils/useRenderCount";
import Spinner from "react-bootstrap/Spinner";

export default function EventProducer() {
  const { RenderContainer } = useRenderCount();
  const config = {
    url: `https://jsonplaceholder.typicode.com/todos/1`
  };

  const loadingComponent = () => {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  };

  const { data, Container, refetch } = useResource(config, "todoDetails", {
    useMessageQueue: true,
    useGlobalContext: true,
    globalFetchingComponent: loadingComponent,
    globalLoadingComponent: loadingComponent
  });

  return (
    <div className="App">
      <RenderContainer />
      <Container hideWhenLoading>
        <div className="px-3 py-2 font-mono bg-gray-300">
          Content: {JSON.stringify(data)}
        </div>

        <button
          onClick={() =>
            refetch({
              url: `https://jsonplaceholder.typicode.com/todos/2`
            })
          }
          className="mt-2 btn btn-primary"
        >
          Update
        </button>
      </Container>
    </div>
  );
}
