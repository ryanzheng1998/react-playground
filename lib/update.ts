export const update =
  (index: number) =>
  <T>(value: T) =>
  (array: T[]): T[] =>
    [...array.slice(0, index), value, ...array.slice(index + 1)]
