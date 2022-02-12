import "./styles.css";
import { useResource } from "./lib/useResource";
import { useState, useRef, useContext } from "react";
import { GlobalResource } from "./lib";
import { CommonTypes, HookTypes } from "./lib/types";

export default function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const renderCount = useRef(0);
  const getConfig = (
    pageNum = pageNumber
  ): CommonTypes.ChainedRequestConfigType[] => [
    {
      baseConfig: {
        url: `https://jsonplaceholder.typicode.com/todos/1`
      }
    },
    {
      baseConfig: {
        url: `https://jsonplaceholder.typicode.com/todos/2`
      },
      task: (config) => {
        config.params = {
          hi: "hello"
        };
        return config;
      }
    },
    {
      baseConfig: {
        url: `https://jsonplaceholder.typicode.com/todos/3`
      }
    },
    {
      baseConfig: {
        url: `https://jsonplaceholder.typicode.com/todos/4`
      }
    }
  ];

  const { selector } = useContext(GlobalResource.Context);
  const stateSlice = selector("todoDetails", (data) => {
    return data;
  });

  const useResourceMain: HookTypes.UseResourceType = (
    config,
    name,
    options = {}
  ) => useResource(config, name, { useGlobalContext: false, ...options });

  const { refetch } = useResourceMain(getConfig(), "todoDetails", {
    useGlobalContext: true
  });

  // useResourceMain(getConfig(), "todoDetails2", {
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
    refetch(getConfig(newPageNumber));
  };

  return (
    <div className="App">
      <div>Render count: {renderCount.current}</div>
      <div>Page number: {pageNumber}</div>
      <div>Content: {JSON.stringify(stateSlice?.isLoading)}</div>
      <div onClick={handleClick}>refetch</div>
    </div>
  );
}
