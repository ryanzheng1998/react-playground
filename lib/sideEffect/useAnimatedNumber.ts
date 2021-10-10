import React from 'react'
import { stepper } from '../animated-number/stepper'
import { AnimatedNumber, Spring } from '../animated-number/types'
import { useAnimation } from './useAnimation'

export interface AnimatedNumberConfig {
  onRest?: () => void
  default: number
  spring: Spring
}

export const useAnimatedNumber = (
  animatedNumberConfg: AnimatedNumberConfig
): AnimatedNumber => {
  const [state, setState] = React.useState({
    timeStamp: 0,
    lastUpdate: 0,
    animatedNumber: {
      current: animatedNumberConfg.default,
      velocity: 0,
      lastIdealValue: 0,
      lastIdealVelocity: 0,
    } as AnimatedNumber,
  })

  const animationRef = React.useRef(0)

  const step = React.useCallback(
    (t1: number) => (t2: number) => {
      const resolution = 8 // 120 fps
      if (t2 - t1 > resolution) {
        const newAnimatedNumber = stepper(state.timeStamp)(state.lastUpdate)(8)(
          animatedNumberConfg.spring
        )(state.animatedNumber)
        setState({
          ...state,
          timeStamp: t2,
          lastUpdate: state.timeStamp,
          animatedNumber: newAnimatedNumber,
        })

        animationRef.current = requestAnimationFrame(step(t2))
      } else {
        animationRef.current = requestAnimationFrame(step(t1))
      }
    },
    []
  )

  React.useEffect(() => {
    animationRef.current = requestAnimationFrame(step(0))
    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  return state.animatedNumber
}
