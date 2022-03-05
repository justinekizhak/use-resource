import { useResource } from "../lib";
import { useRenderCount } from "../examples/utils/useRenderCount";
import { render, screen, getNodeText, waitFor } from "@testing-library/react";
import { sampleData } from "./mocks/data/sample-data";

const Wrapper = () => {
  const { RenderContainer } = useRenderCount();
  const { data } = useResource({
    url: "https://test.com/test/1"
  });

  return (
    <div>
      <RenderContainer />
      <div title="data">{JSON.stringify(data)}</div>
    </div>
  );
};

const setup = () => {
  render(<Wrapper />);
};

describe("basic-example", () => {
  it("Check render count", async () => {
    setup();
    const counterEl = await screen.findByTitle("render-counter");
    const value = getNodeText(counterEl);
    expect(value).toBe("2");
  });
  it("Check data content", async () => {
    setup();
    await waitFor(() => {}, { timeout: 1000 });
    const dataEl = await screen.findByTitle("data");
    const value = getNodeText(dataEl);
    const expectedValue = JSON.stringify(sampleData);
    expect(value).toBe(expectedValue);
  });
});
