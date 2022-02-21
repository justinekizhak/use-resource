// @ts-nocheck
import { getAllDependencyName } from "lib/utils/requestChain";
import { getRequestChainName } from "../helpers/requestChain";

describe("Test getAllDependencyName", () => {
  test("Test All valid", () => {
    const config = getRequestChainName("bothPresent");
    const names = getAllDependencyName(config);
    expect(names).toStrictEqual(["1ReqId", "2ReqId"]);
  });
  test("Test first missing", () => {
    const config = getRequestChainName("firstMissing");
    const names = getAllDependencyName(config);
    expect(names).toStrictEqual(["0", "2ReqId"]);
  });
  test("Test second missing", () => {
    const config = getRequestChainName("secondMissing");
    const names = getAllDependencyName(config);
    expect(names).toStrictEqual(["1ReqId", "1"]);
  });
  test("Test both missing", () => {
    const config = getRequestChainName("bothMissing");
    const names = getAllDependencyName(config);
    expect(names).toStrictEqual(["0", "1"]);
  });
});
