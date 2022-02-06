# useResource

The easiest way to fetch data from an API without any boilerplate code.

# Example

## Basic example

Fetching data from an API

Features:

1. Loader
2. Error handling
3. Refetching data

```jsx
import { useResource } from "./lib/useResource";
import { useState } from "react";

export default function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const getConfig = (_pageNumber = pageNumber) => {
    url: `https://jsonplaceholder.typicode.com/todos/${_pageNumber}`;
  };

  const { data, Container, refetch } = useResource(getConfig(), "todoDetails");

  const handleClick = () => {
    const newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);
    refetch(getConfig(newPageNumber));
  };

  return (
    <div>
      <div>Page number: {pageNumber}</div>
      <Container>{JSON.stringify(data)}</Container>
      <div onClick={handleClick}>refetch</div>
    </div>
  );
}
```
