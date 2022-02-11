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
import { useResource } from "@justinekizhak/use-resource-hook";

export default function App() {
  const { data, Container } = useResource(
    {
      url: "https://jsonplaceholder.typicode.com/posts"
    },
    "fetchPost"
  );
  return (
    <div className="App">
      <Container>{JSON.stringify(data)}</Container>
    </div>
  );
}
```
# Documentation

[Doc site](https://use-resource-hook.vercel.app/)

[Doc repo](https://github.com/justinekizhak/use-resource-hook-docs)
