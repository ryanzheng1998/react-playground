import { Vector } from './types'

export const vectorSubtract =
  (a: Vector) =>
  (b: Vector): Vector => ({
    x: a.x - b.x,
    y: a.y - b.y,
  })
