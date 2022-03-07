import { useResource } from "../lib";
import { useRenderCount } from "../examples/utils/useRenderCount";
import {
  render,
  screen,
  getNodeText,
  waitForElementToBeRemoved
} from "@testing-library/react";
import snapshotDiff from "snapshot-diff";

const Wrapper = () => {
  const { RenderContainer } = useRenderCount();
  const { data, Container } = useResource({
    url: "https://test.com/test/1"
  });

  return (
    <>
      <RenderContainer />
      <Container>
        <div>{JSON.stringify(data)}</div>
      </Container>
    </>
  );
};

const setup = () => {
  return render(<Wrapper />);
};

describe("basic-example", () => {
  it("Check render count", async () => {
    setup();
    const counterEl = await screen.findByTitle("render-counter");
    const value = getNodeText(counterEl);
    expect(value).toBe("2");
  });
  it("Check data content", async () => {
    const { asFragment } = setup();
    const initialRender = asFragment();
    await waitForElementToBeRemoved(screen.getByText("Loading..."));
    const afterLoading = asFragment();
    expect(snapshotDiff(initialRender, afterLoading)).toMatchSnapshot();
  });
});
