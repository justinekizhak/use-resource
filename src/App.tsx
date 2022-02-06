import "./styles.css";
import { useResource } from "./useResource";
import { useState } from "react";
import { ChainedRequestConfigType } from "./interfaces";

export default function App() {
  const [pageNumber, setPageNumber] = useState(1);
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

  const { data, Container, refetch } = useResource(getConfig(), "todoDetails");

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
