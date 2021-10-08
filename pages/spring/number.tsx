import React from 'react'
import styled from 'styled-components'
import { useSpring, animated, config } from 'react-spring'

interface Props {}

// ----------------------
// state model
// ----------------------

interface State {
  number: number
}

const initState: State = {
  number: 0,
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
        number: 0,
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

  const [flip, set] = React.useState(false)

  const { number } = useSpring({
    reset: true,
    reverse: flip,
    from: { number: 0 },
    number: 1,
    delay: 200,
    config: config.molasses,
    onRest: () => set(!flip),
  })

  return (
    <>
      <animated.div>{number.to((n) => n.toFixed(2))}</animated.div>
    </>
  )
}

export default Page
