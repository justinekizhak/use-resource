import "./styles.css";
import { useResource } from "./useResource";
import { useState } from "react";

export default function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const getConfig = (pageNum = pageNumber) => ({
    url: `https://jsonplaceholder.typicode.com/todos/${pageNum}`
  });
  const { data, Container, refetch } = useResource(getConfig());

  const handleClick = () => {
    const newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);
    refetch(getConfig(newPageNumber));
  };

  return (
    <div className="App">
      <div>Page number: {pageNumber}</div>
      <Container>
        {JSON.stringify(data)}

        <div onClick={handleClick}>refetch</div>
      </Container>
    </div>
  );
}
