import { useState } from "react";
import { useResource } from "../lib-imports";
import { BaseConfig_T } from "../lib-imports";
import { useRenderCount } from "../utils/useRenderCount";

export default function ApiInvoker() {
  const [todoIndex, setTodoIndex] = useState(1);
  const { RenderContainer } = useRenderCount();

  const getConfig = (todoIndex = 1): BaseConfig_T => ({
    url: `https://jsonplaceholder.typicode.com/todos/${todoIndex}`
  });

  const { data, refetch } = useResource(getConfig(), "test", {
    useGlobalContext: true
  });

  const handleClick = () => {
    const newIndex = todoIndex + 1;
    refetch(getConfig(newIndex));
    setTodoIndex(newIndex);
  };

  return (
    <div>
      <h1 className="display-6">API Invoker</h1>
      <RenderContainer />
      <div className="px-3 py-2 font-mono bg-gray-300">
        {JSON.stringify(data)}
      </div>
      <button onClick={handleClick} className="mt-2 btn btn-primary">
        Next item
      </button>
    </div>
  );
}
