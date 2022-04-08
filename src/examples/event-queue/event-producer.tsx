import { useResource } from "../../lib";
import { useRenderCount } from "../utils/useRenderCount";

export default function EventProducer() {
  const { RenderContainer } = useRenderCount();
  const config = {
    url: `https://jsonplaceholder.typicode.com/todos/1`
  };

  const { data, Container, refetch } = useResource(config, "todoDetails", {
    useMessageQueue: true,
    useGlobalContext: true
  });

  // const refetch = useSelector("todoDetails", "refetch");
  // const duplicateData = useSelector("todoDetails", "data");

  // const { data: data2 } = useResource(config, "todoDetails2", {
  //   useMessageQueue: true,
  //   useGlobalContext: false
  // });

  return (
    <div className="App">
      <RenderContainer />
      <Container>
        <div>Content: {JSON.stringify(data)}</div>
        {/* <div>Content duplicate: {JSON.stringify(duplicateData)}</div> */}
        {/* <div>Content 2: {JSON.stringify(data2)}</div> */}

        <button
          onClick={() =>
            refetch({
              url: `https://jsonplaceholder.typicode.com/todos/2`
            })
          }
        >
          Update
        </button>
      </Container>
    </div>
  );
}
