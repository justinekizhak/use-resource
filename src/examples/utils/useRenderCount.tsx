import { useRef } from "react";

export const useRenderCount = () => {
  const renderCount = useRef(1);
  const renderTimestamp = useRef([]);

  const currentTime = Date.now();

  renderCount.current++;
  renderTimestamp.current.push(currentTime);

  const Container = (props) => {
    return (
      <div>
        <div>Total render count: {renderCount.current}</div>
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
