import { useResource } from "../../lib";
import { useState, useRef } from "react";
import { HookTypes } from "../../lib/types";

export default function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const renderCount = useRef(0);
  const config: HookTypes.ChainedRequestConfigType[] = [
    {
      baseConfig: {
        url: `https://jsonplaceholder.typicode.com/todos/1`
      },
      requestName: "1",
      dependencyList: null
    },
    {
      baseConfig: {
        url: `https://jsonplaceholder.typicode.com/todos/2`
      },
      transformConfig: (config) => {
        config.params = {
          hi: "hello"
        };
      },
      requestName: "2",
      dependencyList: ["1"]
    },
    {
      baseConfig: {
        url: `https://jsonplaceholder.typicode.com/todos/3`
      },
      requestName: "3",
      dependencyList: ["1"]
    },
    {
      baseConfig: {
        url: `https://jsonplaceholder.typicode.com/todos/4`
      },
      requestName: "4",
      dependencyList: ["3"]
    },
    {
      baseConfig: {
        url: `https://jsonplaceholder.typicode.com/todos/5`
      },
      requestName: "5",
      dependencyList: ["2", "4"]
    }
  ];

  // const { selector } = useContext(GlobalResource.Context);
  // const stateSlice = selector("todoDetails", (data) => {
  //   return data;
  // });

  // const useResourceMain: HookTypes.UseResourceType = (
  //   config,
  //   name,
  //   options = {}
  // ) =>
  //   useResource(config, name, {
  //     useGlobalContext: false,
  //     ...options
  //   });

  const { refetch, data, Container } = useResource(config, "todoDetails", {
    useGlobalContext: false,
    devMode: false
  });

  // useResource(config, "todoDetails2", {
  //   useGlobalContext: false
  // });
  // useResource(config, "todoDetails3", {
  //   useGlobalContext: false
  // });
  // useResourceMain(getConfig(), "todoDetails3", {
  //   useGlobalContext: false
  // });
  // useResourceMain(getConfig(), "todoDetails4", {
  //   useGlobalContext: false
  // });
  renderCount.current++;

  const handleClick = () => {
    const newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);
    refetch(config);
  };

  return (
    <div className="App">
      <div>Render count: {renderCount.current}</div>
      <div>Page number: {pageNumber}</div>
      <Container>
        <div>Content: {JSON.stringify(data)}</div>
      </Container>
      <div onClick={handleClick}>refetch</div>
    </div>
  );
}
