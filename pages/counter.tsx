import React from 'react'

interface Props {}

// ----------------------
// state model
// ----------------------

interface State {
  value: number
}

const initState: State = {
  value: 0,
}

// ----------------------
// action model
// ----------------------
const Incremenet = () => ({
  type: 'INCREMENT' as const,
})

const Decrement = () => ({
  type: 'DECREMENT' as const,
})

type Action = ReturnType<typeof Incremenet> | ReturnType<typeof Decrement>

// ----------------------
// update
// ----------------------
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        value: state.value + 1,
      }
    case 'DECREMENT':
      return {
        ...state,
        value: state.value - 1,
      }
  }
}

// ----------------------
// draw
// ----------------------
const Page: React.FC<Props> = () => {
  const [state, dispatch] = React.useReducer(reducer, initState)

  return (
    <>
      <p>Count: {state.value}</p>
      <button onClick={() => dispatch(Decrement())}>-</button>
      <button onClick={() => dispatch(Incremenet())}>+</button>
    </>
  )
}

export default Page
