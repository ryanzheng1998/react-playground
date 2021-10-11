import React from 'react'
import { isOnRest } from '../animated-number/isOnRest'
import { stepper } from '../animated-number/stepper'
import { AnimatedNumber, Spring } from '../animated-number/types'

export interface AnimatedNumberConfig {
  onRest?: () => void
  defaultStyle: number
  style: Spring
}

const msPerFrame = 8 // 120 fpc

// ----------------------
// state model
// ----------------------

interface State {
  timeStamp: number
  lastUpdate: number
  spring: Spring
  animatedNumber: AnimatedNumber
}

// ----------------------
// action model
// ----------------------
const Tick = (tick: number) => ({
  type: 'TICK' as const,
  payload: tick,
})

const SetSpring = (spring: Spring) => ({
  type: 'SET_SPRING' as const,
  payload: spring,
})

type Action = ReturnType<typeof Tick> | ReturnType<typeof SetSpring>

// ----------------------
// update
// ----------------------
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TICK':
      const newAnimatedNumber = stepper(state.timeStamp)(state.lastUpdate)(
        msPerFrame
      )(state.spring)(state.animatedNumber)

      return {
        ...state,
        timeStamp: action.payload,
        lastUpdate: state.timeStamp,
        animatedNumber: newAnimatedNumber,
      }
    case 'SET_SPRING':
      return {
        ...state,
        timeStamp: performance.now(),
        lastUpdate: performance.now(),
        spring: action.payload,
      }
  }
}

export const useAnimatedNumber = (
  animatedNumberConfig: AnimatedNumberConfig,
  dep: React.DependencyList
): AnimatedNumber => {
  const config = React.useMemo(() => animatedNumberConfig, dep)

  React.useEffect(() => {
    dispatch(SetSpring(config.style))
  }, [config])

  const initState: State = {
    timeStamp: 0,
    lastUpdate: 0,
    spring: config.style,
    animatedNumber: {
      current: config.defaultStyle,
      velocity: 0,
      lastIdealValue: 0,
      lastIdealVelocity: 0,
    },
  }

  const [state, dispatch] = React.useReducer(reducer, initState)

  const onRest = isOnRest(config.style.val)(state.animatedNumber)

  const animationRef = React.useRef(0)

  const tempOnRest = config.onRest

  const step = React.useCallback(
    (t1: number) => (t2: number) => {
      if (t2 - t1 > msPerFrame) {
        if (onRest) {
          if (tempOnRest) {
            tempOnRest()
          }
          return
        }
        dispatch(Tick(t2))
        animationRef.current = requestAnimationFrame(step(t2))
      } else {
        animationRef.current = requestAnimationFrame(step(t1))
      }
    },
    [onRest, tempOnRest]
  )

  React.useEffect(() => {
    animationRef.current = requestAnimationFrame(step(0))
    return () => cancelAnimationFrame(animationRef.current)
  }, [step])

  return state.animatedNumber
}
