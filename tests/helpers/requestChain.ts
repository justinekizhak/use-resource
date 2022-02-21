export function getRequestChain() {
  const baseConfig = [
    {
      requestName: "1ReqId"
    },
    {
      requestName: "2ReqId",
      dependencyList: ["1ReqId"]
    }
  ];
  return baseConfig;
}

export function getInvalidRequestChain() {
  const baseConfig = [
    {
      requestName: "1ReqId"
    },
    {
      requestName: "2ReqId",
      dependencyList: ["InvalidReqId"]
    }
  ];
  return baseConfig;
}

export function getCyclicRequestChain() {
  const baseConfig = [];
  return baseConfig;
}

export function getRequestChainName(caseName) {
  const bothPresent = [
    {
      requestName: "1ReqId"
    },
    {
      requestName: "2ReqId"
    }
  ];
  const firstMissing = [
    {},
    {
      requestName: "2ReqId"
    }
  ];
  const secondMissing = [
    {
      requestName: "1ReqId"
    },
    {}
  ];
  const bothMissing = [{}, {}];
  switch (caseName) {
    case "bothPresent":
      return bothPresent;
    case "firstMissing":
      return firstMissing;
    case "secondMissing":
      return secondMissing;
    case "bothMissing":
      return bothMissing;
    default:
      return bothPresent;
  }
}
