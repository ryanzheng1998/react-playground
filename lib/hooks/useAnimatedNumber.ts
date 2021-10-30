import React from 'react'
import { isOnRest } from '../animated-number/isOnRest'
import { stepper } from '../animated-number/stepper'
import { AnimatedNumber, Spring } from '../animated-number/types'
import { usePrevious } from './usePrevious'

export interface AnimatedNumberConfig {
  onRest?: () => void
  defaultStyle: number
  style: Spring | number
}

const msPerFrame = 8 // 120 fps

// ----------------------
// state model
// ----------------------
interface State {
  timeStamp: number // in millisecond
  style: Spring | number
  animatedNumber: AnimatedNumber
  onRest: boolean // computed value, store here for the sake of convenience and readablily
}

// ----------------------
// action model
// ---------------------
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
      // this is imposible to happen, but leave this here just in case
      if (typeof state.style === 'number') {
        return {
          ...state,
          timeStamp: action.payload,
          onRest: true,
          animatedNumber: {
            current: state.style,
            velocity: 0,
            lastIdealValue: state.style,
            lastIdealVelocity: 0,
          },
        }
      }

      const newAnimatedNumber = stepper(action.payload)(state.timeStamp)(
        msPerFrame
      )(state.style)(state.animatedNumber)

      return {
        ...state,
        timeStamp: action.payload,
        animatedNumber: newAnimatedNumber,
        onRest: isOnRest(state.style.val)(newAnimatedNumber),
      }

    case 'SET_STYLE':
      if (typeof action.payload === 'number') {
        return {
          ...state,
          timeStamp: performance.now(),
          style: action.payload,
          onRest: true,
          animatedNumber: {
            current: action.payload,
            velocity: 0,
            lastIdealValue: action.payload,
            lastIdealVelocity: 0,
          },
        }
      }
      return {
        ...state,
        timeStamp: performance.now(),
        style: action.payload,
        onRest: isOnRest(action.payload.val)(state.animatedNumber),
      }
  }
}

export const useAnimatedNumber = (
  animatedNumberConfig: AnimatedNumberConfig,
  dep: React.DependencyList
): AnimatedNumber => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const config = React.useMemo(() => animatedNumberConfig, dep)

  React.useEffect(() => {
    dispatch(SetStyle(config.style))
  }, [config])

  const initState: State = {
    timeStamp: 0,
    onRest: (() => {
      if (typeof config.style === 'number') return true
      return config.style.val === config.defaultStyle
    })(),
    style: config.style,
    animatedNumber: {
      current: config.defaultStyle,
      velocity: 0,
      lastIdealValue: config.defaultStyle,
      lastIdealVelocity: 0,
    },
  }

  const [state, dispatch] = React.useReducer(reducer, initState)

  const animationRef = React.useRef(0)

  const step = React.useCallback(
    (t1: number) => (t2: number) => {
      if (t2 - t1 > msPerFrame) {
        if (state.onRest) {
          return
        }
        dispatch(Tick(t2))
        animationRef.current = requestAnimationFrame(step(t2))
      } else {
        animationRef.current = requestAnimationFrame(step(t1))
      }
    },
    [state.onRest]
  )

  React.useEffect(() => {
    animationRef.current = requestAnimationFrame(step(performance.now()))
    return () => cancelAnimationFrame(animationRef.current)
  }, [step])

  const previousOnRest = usePrevious(state.onRest)

  const tempOnRestFunction = config.onRest

  React.useEffect(() => {
    if (state.onRest && previousOnRest !== undefined && !previousOnRest) {
      tempOnRestFunction?.()
    }
  }, [state.onRest, previousOnRest, tempOnRestFunction])

  return state.animatedNumber
}
