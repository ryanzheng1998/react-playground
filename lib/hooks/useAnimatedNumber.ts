import React from 'react'
import { isOnRest } from '../animated-number/isOnRest'
import { stepper } from '../animated-number/stepper'
import { AnimatedNumber, Spring } from '../animated-number/types'

export interface AnimatedNumberConfig {
  onRest?: () => void
  defaultStyle: number
  style: Spring | number
}

const msPerFrame = 8 // 120 fpc

// ----------------------
// state model
// ----------------------

interface State {
  timeStamp: number
  lastUpdate: number
  onRest: boolean
  style: Spring | number
  animatedNumber: AnimatedNumber
}

// ----------------------
// action model
// ----------------------
const Tick = (tick: number) => ({
  type: 'TICK' as const,
  payload: tick,
})

const SetStyle = (style: Spring | number) => ({
  type: 'SET_STYLE' as const,
  payload: style,
})

type Action = ReturnType<typeof Tick> | ReturnType<typeof SetStyle>

// ----------------------
// update
// ----------------------
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TICK':
      if (typeof state.style === 'number') {
        return {
          ...state,
          timeStamp: action.payload,
          lastUpdate: state.timeStamp,
          onRest: true,
          animatedNumber: {
            current: state.style,
            velocity: 0,
            lastIdealValue: state.style,
            lastIdealVelocity: 0,
          },
        }
      }

      const newAnimatedNumber = stepper(state.timeStamp)(state.lastUpdate)(
        msPerFrame
      )(state.style)(state.animatedNumber)

      return {
        ...state,
        timeStamp: action.payload,
        lastUpdate: state.timeStamp,
        animatedNumber: newAnimatedNumber,
        onRest: isOnRest(state.style.val)(state.animatedNumber),
      }
    case 'SET_STYLE':
      return {
        ...state,
        timeStamp: performance.now(),
        lastUpdate: performance.now(),
        style: action.payload,
        animatedNumber:
          typeof action.payload !== 'number'
            ? state.animatedNumber
            : {
                current: action.payload,
                velocity: 0,
                lastIdealValue: action.payload,
                lastIdealVelocity: 0,
              },
        onRest: typeof action.payload === 'number',
      }
  }
}

export const useAnimatedNumber = (
  animatedNumberConfig: AnimatedNumberConfig,
  dep: React.DependencyList
): AnimatedNumber => {
  const config = React.useMemo(() => animatedNumberConfig, dep)

  React.useEffect(() => {
    dispatch(SetStyle(config.style))
  }, [config])

  const initState: State = {
    timeStamp: 0,
    lastUpdate: 0,
    onRest: false,
    style: animatedNumberConfig.style,
    animatedNumber: {
      current: config.defaultStyle,
      velocity: 0,
      lastIdealValue: 0,
      lastIdealVelocity: 0,
    },
  }

  const [state, dispatch] = React.useReducer(reducer, initState)

  const animationRef = React.useRef(0)

  const tempOnRestFunction = animatedNumberConfig.onRest

  const step = React.useCallback(
    (t1: number) => (t2: number) => {
      if (t2 - t1 > msPerFrame) {
        if (state.onRest) {
          if (tempOnRestFunction) {
            tempOnRestFunction()
          }
          return
        }
        dispatch(Tick(t2))
        animationRef.current = requestAnimationFrame(step(t2))
      } else {
        animationRef.current = requestAnimationFrame(step(t1))
      }
    },
    [tempOnRestFunction, state.onRest]
  )

  React.useEffect(() => {
    animationRef.current = requestAnimationFrame(step(0))
    return () => cancelAnimationFrame(animationRef.current)
  }, [step])

  return state.animatedNumber
}
