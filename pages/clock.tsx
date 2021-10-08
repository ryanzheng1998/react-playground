import React from 'react'

interface Props {}

// ----------------------
// state model
// ----------------------

interface State {
  timeStamp: number // millisecond
  updateCount: number
}

const initState: State = {
  timeStamp: 0,
  updateCount: 0,
}

// ----------------------
// action model
// ----------------------
const tick = (tick: number) => ({
  type: 'TICK' as const,
  payload: tick,
})

type Action = ReturnType<typeof tick>

// ----------------------
// update
// ----------------------
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TICK':
      return {
        ...state,
        timeStamp: action.payload,
      }
  }
}

// ----------------------
// draw
// ----------------------
const Page: React.FC<Props> = () => {
  const [state, dispatch] = React.useReducer(reducer, initState)

  const animationRef = React.useRef(0)

  const step = (t1: number) => (t2: number) => {
    const resolution = 8 // 120 fps
    if (t2 - t1 > resolution) {
      dispatch(tick(t2))
      animationRef.current = requestAnimationFrame(step(t2))
    } else {
      animationRef.current = requestAnimationFrame(step(t1))
    }
  }

  React.useEffect(() => {
    animationRef.current = requestAnimationFrame(step(0))
    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  return (
    <>
      <p>Current Time: {state.timeStamp}</p>
    </>
  )
}

export default Page
