import React from 'react'
import { isOnRest } from '../../lib/animated-number/isOnRest'
import { spring } from '../../lib/animated-number/spring'
import { stepper } from '../../lib/animated-number/stepper'
import { AnimatedNumber } from '../../lib/animated-number/types'
import { useAnimation } from '../../lib/sideEffect/useAnimation'

// ----------------------
// state model
// ----------------------

interface State {
  target: number
  onRest: boolean
  animatedNumber: AnimatedNumber
}

const initState: State = {
  target: 10,
  onRest: false,
  animatedNumber: {
    current: 0,
    velocity: 0,
    lastIdealValue: 0,
    lastIdndealVelocity: 0,
  },
}

// ----------------------
// action model
// ----------------------
const Tick = (tick: number) => ({
  type: 'TICK' as const,
  payload: tick,
})

const Flip = () => ({
  type: 'FLIP' as const,
})

type Action = ReturnType<typeof Tick> | ReturnType<typeof Flip>

// ----------------------
// update
// ----------------------
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TICK':
      const newAnimatedNumber = stepper(8 / 1000)(spring(state.target))(
        state.animatedNumber
      )

      return {
        ...state,
        onRest: isOnRest(state.target)(newAnimatedNumber),
        animatedNumber: newAnimatedNumber,
      }
    case 'FLIP':
      return {
        ...state,
        target: state.target === 10 ? 0 : 10,
      }
  }
}

// ----------------------
// draw
// ----------------------
const Page: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initState)

  useAnimation((t: number) => {
    dispatch(Tick(t))
  }, [])

  React.useEffect(() => {
    if (state.onRest) {
      setTimeout(() => {
        dispatch(Flip())
      }, 2000)
    }
  }, [state.onRest])

  return (
    <>
      <p>Number: {state.animatedNumber.current.toFixed(2)}</p>
    </>
  )
}

export default Page
