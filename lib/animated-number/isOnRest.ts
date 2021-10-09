import { AnimatedNumber } from './types'

export const isOnRest =
  (target: number) =>
  (animatedNumber: AnimatedNumber): boolean => {
    if (animatedNumber.velocity !== 0) return false
    if (animatedNumber.current !== target) return false

    return true
  }
