import React from 'react'
import { isOnRest } from '../animated-number/isOnRest'
import { stepper } from '../animated-number/stepper'
import { AnimatedNumber, Spring } from '../animated-number/types'

export interface AnimatedNumberConfig {
  onRest?: () => void
  default: number
  spring: Spring
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

const SetTarget = (target: number) => ({
  type: 'SET_TARGET' as const,
  payload: target,
})

const SetSpring = (spring: Spring) => ({
  type: 'SET_SPRING' as const,
  payload: spring,
})

const Filp = ([from, to]: [number, number]) => ({
  type: 'FLIP' as const,
  payload: [from, to],
})

type Action =
  | ReturnType<typeof Tick>
  | ReturnType<typeof SetTarget>
  | ReturnType<typeof SetSpring>
  | ReturnType<typeof Filp>

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
    case 'SET_TARGET':
      return {
        ...state,
        timeStamp: performance.now(),
        lastUpdate: performance.now(),
        spring: {
          ...state.spring,
          val: action.payload,
        },
      }
    case 'SET_SPRING':
      return {
        ...state,
        timeStamp: performance.now(),
        lastUpdate: performance.now(),
        spring: action.payload,
      }
    case 'FLIP':
      return {
        ...state,
        timeStamp: performance.now(),
        lastUpdate: performance.now(),
        spring: {
          ...state.spring,
          val:
            state.spring.val === action.payload[0]
              ? action.payload[1]
              : action.payload[0],
        },
      }
  }
}

export const useAnimatedNumber = (
  animatedNumberConfg: AnimatedNumberConfig
): AnimatedNumber => {
  const initState: State = {
    timeStamp: 0,
    lastUpdate: 0,
    spring: animatedNumberConfg.spring,
    animatedNumber: {
      current: animatedNumberConfg.default,
      velocity: 0,
      lastIdealValue: 0,
      lastIdealVelocity: 0,
    },
  }

  const [state, dispatch] = React.useReducer(reducer, initState)

  const onRest = isOnRest(animatedNumberConfg.spring.val)(state.animatedNumber)

  const animationRef = React.useRef(0)

  const tempOnRest = animatedNumberConfg.onRest

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

  React.useEffect(() => {
    if (onRest === true) {
      setTimeout(() => {
        dispatch(Filp([0, 10]))
      }, 2000)
    }
  }, [onRest])

  return state.animatedNumber
}
