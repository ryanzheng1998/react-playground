import React from 'react'
import { Motion } from 'react-motion'
import { isOnRest } from '../../lib/animated-number/isOnRest'
import { spring } from '../../lib/animated-number/spring'
import { stepper } from '../../lib/animated-number/stepper'
import { AnimatedNumber } from '../../lib/animated-number/types'

const msPerFrame = 8 // 120 fpc

// ----------------------
// state model
// ----------------------

interface State {
  timeStamp: number
  lastUpdate: number
  target: number
  animatedNumber: AnimatedNumber
}

const initState: State = {
  timeStamp: 0,
  lastUpdate: 0,
  target: 0,
  animatedNumber: {
    current: 0,
    velocity: 0,
    lastIdealValue: 0,
    lastIdealVelocity: 0,
  },
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

const Filp = ([from, to]: [number, number]) => ({
  type: 'FLIP' as const,
  payload: [from, to],
})

type Action =
  | ReturnType<typeof Tick>
  | ReturnType<typeof SetTarget>
  | ReturnType<typeof Filp>

// ----------------------
// update
// ----------------------
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TICK':
      const newAnimatedNumber = stepper(state.timeStamp)(state.lastUpdate)(
        msPerFrame
      )(spring(state.target))(state.animatedNumber)

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
        target: action.payload,
      }
    case 'FLIP':
      return {
        ...state,
        timeStamp: performance.now(),
        lastUpdate: performance.now(),
        target:
          state.target === action.payload[0]
            ? action.payload[1]
            : action.payload[0],
      }
  }
}

const Page: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initState)

  const onRest = isOnRest(state.target)(state.animatedNumber)

  const animationRef = React.useRef(0)

  const step = React.useCallback(
    (t1: number) => (t2: number) => {
      if (t2 - t1 > msPerFrame) {
        if (onRest) {
          return
        }
        dispatch(Tick(t2))
        animationRef.current = requestAnimationFrame(step(t2))
      } else {
        animationRef.current = requestAnimationFrame(step(t1))
      }
    },
    [onRest]
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

  return (
    <>
      <Motion defaultStyle={{ x: 0 }} style={{ x: spring(state.target) }}>
        {(value) => <p>Animated Number: {value.x}</p>}
      </Motion>
      <p>Animated Number: {state.animatedNumber.current}</p>
    </>
  )
}

export default Page
