import type { AccumulatorContainer_T } from "../types";

/**
 * Use this function to generate a default acc container
 * @returns A object with the shape of the accumulator container.
 */
export function generateDefaultAccContainer(): AccumulatorContainer_T {
  return {
    current: []
  };
}
