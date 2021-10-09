import React from 'react'
import styled from 'styled-components'
import { spring } from '../../lib/animated-number/spring'
import { stepper } from '../../lib/animated-number/stepper'
import { AnimatedNumber } from '../../lib/animated-number/types'
import { useAnimation } from '../../lib/sideEffect/useAnimation'

const Container = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;

  height: 80vh;
  width: 100%;
`

const Box = styled.div`
  box-sizing: content-box;
  width: 200px;
  height: 60px;
  position: relative;
  user-select: none;
  border: 1px solid black;
  overflow: hidden;
  border-radius: 4px;
  :hover {
    cursor: pointer;
  }
`

const Fill = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: #0000ff57;
`

const Text = styled.p`
  text-align: center;
  position: absolute;
  width: 100%;
  z-index: 20;
`

// ----------------------
// state model
// ----------------------

interface State {
  target: number
  nextTarget: number
  animatedNumber: AnimatedNumber
}

const initState: State = {
  target: 0,
  nextTarget: 200,
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

const SetTarget = (target: number) => ({
  type: 'SET_TARGET' as const,
  payload: target,
})
type Action = ReturnType<typeof Tick> | ReturnType<typeof SetTarget>

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
        animatedNumber: newAnimatedNumber,
      }
    case 'SET_TARGET':
      return {
        ...state,
        target: action.payload,
      }
  }
}

const Page: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initState)

  useAnimation((t: number) => {
    dispatch(Tick(t))
  }, [])

  return (
    <Container>
      <Box
        onClick={() => {
          dispatch(SetTarget(state.target === 200 ? 0 : 200))
        }}
      >
        <Fill style={{ width: state.animatedNumber.current }} />
        <Text>{state.animatedNumber.current.toFixed(0)}</Text>
      </Box>
    </Container>
  )
}

export default Page
