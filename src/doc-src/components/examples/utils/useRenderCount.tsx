import { useRef } from "react";

export const useRenderCount = () => {
  const renderCount = useRef(0);
  const renderTimestamp = useRef([]);

  const currentTime = Date.now();

  renderCount.current++;
  renderTimestamp.current.push(currentTime);

  const Container = (props) => {
    return (
      <div title="render-container">
        <div title="render-count-heading">
          Total render count(including initial render):
          <span title="render-counter">{renderCount.current}</span>
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
