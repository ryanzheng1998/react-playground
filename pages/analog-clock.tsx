import React from 'react'
import styled from 'styled-components'

interface Props {}

// ----------------------
// state model
// ----------------------

interface State {
  date: Date
}

const initState: State = {
  date: new Date(),
}

// ----------------------
// action model
// ----------------------
const Tick = (currentTime: Date) => ({
  type: 'TICK' as const,
  payload: currentTime,
})

type Action = ReturnType<typeof Tick>

// ----------------------
// update
// ----------------------
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TICK':
      return {
        ...state,
        date: action.payload,
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
      dispatch(Tick(new Date()))
      animationRef.current = requestAnimationFrame(step(t2))
    } else {
      animationRef.current = requestAnimationFrame(step(t1))
    }
  }

  React.useEffect(() => {
    animationRef.current = requestAnimationFrame(step(0))
    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  const secondHand = (seconds: number) => {
    const angle = (seconds * 2 * Math.PI) / 60 - Math.PI / 2
    const handX = 50 + 40 * Math.cos(angle)
    const handY = 50 + 40 * Math.sin(angle)

    return (
      <line
        x1={50}
        y1={50}
        x2={handX}
        y2={handY}
        style={{
          stroke: 'black',
          strokeWidth: '0.5px',
        }}
      />
    )
  }

  const miniuteHand = (minutes: number) => {
    const angle = (minutes * 2 * Math.PI) / 60 - Math.PI / 2
    const handX = 50 + 35 * Math.cos(angle)
    const handY = 50 + 35 * Math.sin(angle)

    return (
      <line
        x1={50}
        y1={50}
        x2={handX}
        y2={handY}
        style={{ stroke: 'black', strokeWidth: '1px' }}
      />
    )
  }

  const hourHand = (hours: number) => {
    const angle = (hours * 2 * Math.PI) / 24 - Math.PI / 2
    const handX = 50 + 20 * Math.cos(angle)
    const handY = 50 + 20 * Math.sin(angle)

    return (
      <line
        x1={50}
        y1={50}
        x2={handX}
        y2={handY}
        style={{ stroke: 'black', strokeWidth: '2px' }}
      />
    )
  }

  return (
    <>
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '300px', height: '300px' }}
      >
        <circle cx="50" cy="50" r="45" fill="red" />
        {secondHand(state.date.getSeconds())}
        {miniuteHand(state.date.getMinutes())}
        {hourHand(state.date.getHours())}
        <circle cx="50" cy="50" r="2" fill="black" />
      </svg>
      <p>{state.date.toString()}</p>
    </>
  )
}

export default Page
