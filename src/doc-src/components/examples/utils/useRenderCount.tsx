import { useRef } from "react";

export const useRenderCount = () => {
  const renderCount = useRef(0);
  const renderTimestamp = useRef([]);

  const currentTime = Date.now();

  renderCount.current++;
  renderTimestamp.current.push(currentTime);

  const Container = (props) => {
    return (
      <div
        title="render-container"
        className="px-3 py-2 my-2 text-white rounded bg-zinc-700"
      >
        <div title="render-count-heading">
          Total render count(including initial render):
          <span
            title="render-counter"
            className="inline-flex items-center justify-center w-8 h-8 ml-3 text-black bg-white rounded-full"
          >
            {renderCount.current}
          </span>
        </div>
        {props?.showTimestamps &&
          renderTimestamp.current.map((timestamp, index) => {
            return (
              <div>
                Render count: {index + 1}, Timestamp: {timestamp}
              </div>
            );
          })}
      </div>
    );
  };
  return { renderCount: renderCount.current, RenderContainer: Container };
};
