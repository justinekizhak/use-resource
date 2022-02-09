import "./styles.css";
import { useResource } from "./lib/useResource";
import { useState, useContext, useEffect } from "react";
import { ChainedRequestConfigType, UseResourceType } from "./lib/interfaces";
import { GlobalResourceContext } from "./lib/resourceContext";

export default function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [renderCount] = useState({ current: 0 });
  const getConfig = (pageNum = pageNumber): ChainedRequestConfigType[] => [
    {
      baseConfig: {
        url: `https://jsonplaceholder.typicode.com/todos/1`
      },
      onFinal: (acc, next) => {
        // console.log("finally 1: ", acc);
      }
    },
    {
      baseConfig: {
        url: `https://jsonplaceholder.typicode.com/todos/2`
      },
      onFinal: (acc, next) => {
        // console.log("finally 2: ", acc);
      }
    }
  ];

  // const { selector } = useContext(GlobalResourceContext);
  // const loading2 = selector((data) => data?.todoDetails?.isLoading);

  console.log("1");

  // useEffect(() => {
  //   renderCount.current++;
  //   console.log("count", renderCount);
  // }, [loading2, renderCount]);

  const useResourceMain: UseResourceType = (config, name, options = {}) =>
    useResource(config, name, { useGlobalContext: false, ...options });

  const { data, Container, refetch } = useResourceMain(
    getConfig(),
    "todoDetails",
    {
      useGlobalContext: false
    }
  );

  // useResourceMain(getConfig(), "todoDetails2", {
  //   useGlobalContext: false
  // });
  // useResourceMain(getConfig(), "todoDetails3", {
  //   useGlobalContext: false
  // });
  // useResourceMain(getConfig(), "todoDetails4", {
  //   useGlobalContext: false
  // });

  const handleClick = () => {
    const newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);
    refetch(getConfig(newPageNumber));
  };

  return (
    <div className="App">
      <div>Page number: {pageNumber}</div>
      <Container>{JSON.stringify(data)}</Container>
      <div onClick={handleClick}>refetch</div>
    </div>
  );
}
