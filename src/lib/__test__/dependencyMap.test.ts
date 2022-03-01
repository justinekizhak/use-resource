// @ts-nocheck
import {
  createDependencyMap,
  validateRequestChain
} from "../requestChain/dependencyMap";
import {
  getRequestChain,
  getInvalidRequestChain,
  getCyclicRequestChain
} from "./helpers/requestChain";

describe("Testing dependency graph", () => {
  test("dependency start: POSITIVE", () => {
    const requestChain = getRequestChain();
    const { dependencyMap, start } = createDependencyMap(requestChain);
    const expectedDependencyMap = { "1ReqId": null, "2ReqId": ["1ReqId"] };
    expect(start).toBe("1ReqId");
    expect(dependencyMap).toStrictEqual(expectedDependencyMap);
  });

  test("Check for Invalid dependency: POSITIVE", () => {
    const requestChain = getRequestChain();
    const isValid = validateRequestChain(requestChain);
    expect(isValid).toBe(true);
  });

  test("Check for Invalid dependency: NEGATIVE", () => {
    const requestChain = getInvalidRequestChain();
    expect(() => {
      validateRequestChain(requestChain);
    }).toThrow(/Invalid deps: /);
  });

  test.skip("Check for cyclic dependency: NEGATIVE", () => {
    const requestChain = getCyclicRequestChain();
    expect(() => {
      validateRequestChain(requestChain);
    }).toThrow(/Dependency cycle found: /);
  });
});
