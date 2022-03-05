import { rest } from "msw";
import { sampleData } from "./data/sample-data";

export const handlers = [
  rest.get("https://test.com/test/1", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(sampleData));
  })
];
