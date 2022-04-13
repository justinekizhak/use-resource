import type { AccumulatorContainer_T, PushToAcc_T } from "../types";

/**
 * Use this function to generate a default acc container
 * @returns A object with the shape of the accumulator container.
 */
export function generateDefaultAccContainer(): AccumulatorContainer_T {
  return {
    data: [],
    events: {},
    requestsByName: {},
    requestsByIndex: {},
    customData: {}
  };
}

/**
 * Use this function to cleanup the accumulator container.
 *
 * @param accumulator The accumulator which should be reset
 * @returns Remove all the data-objects and returns a clean instance.
 */
export function resetAcc(
  accumulator: AccumulatorContainer_T
): AccumulatorContainer_T {
  accumulator.data = [];
  accumulator.events = {};
  accumulator.requestsByName = {};
  accumulator.requestsByIndex = {};
  accumulator.customData = {};
  return accumulator;
}

export function generateDefaultPushToAcc(accumulator: AccumulatorContainer_T) {
  const func: PushToAcc_T = (data, meta = {}) => {
    const { eventKeycode, requestName, requestIndex, customObject } = meta;
    if (data) {
      accumulator.data.push(data);

      // Pushing to event object
      if (eventKeycode) {
        const eventObject = accumulator.events[eventKeycode];
        if (!eventObject) {
          accumulator.events[eventKeycode] = [];
        }
        accumulator.events[eventKeycode]?.push(data);
      }

      // Pushing to request object
      if (eventKeycode && requestName) {
        // checking if reqObject exists
        const reqObj = accumulator.requestsByName[requestName];
        if (!reqObj) {
          accumulator.requestsByName[requestName] = {};
        }
        // Checking if the event object exists
        const eventObj = accumulator.requestsByName[requestName][eventKeycode];
        if (!eventObj) {
          accumulator.requestsByName[requestName][eventKeycode] = [];
        }
        accumulator.requestsByName[requestName][eventKeycode]?.push(data);
      }

      // Pushing to requestsByIndex
      if (eventKeycode && requestIndex) {
        // checking if reqObject exists
        const reqObj = accumulator.requestsByIndex[requestIndex];
        if (!reqObj) {
          accumulator.requestsByIndex[requestIndex] = {};
        }
        // Checking if the event object exists
        const eventObj =
          accumulator.requestsByIndex[requestIndex][eventKeycode];
        if (!eventObj) {
          accumulator.requestsByIndex[requestIndex][eventKeycode] = [];
        }
        accumulator.requestsByIndex[requestIndex][eventKeycode]?.push(data);
      }
    }
    if (customObject) {
      accumulator.customData = customObject;
    }
    return accumulator;
  };
  return func;
}
