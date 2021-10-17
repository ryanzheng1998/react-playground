import React from 'react'
import styled from 'styled-components'
import { isOnRest } from '../../lib/animated-number/isOnRest'
import presents from '../../lib/animated-number/presents'
import { spring } from '../../lib/animated-number/spring'
import { stepper } from '../../lib/animated-number/stepper'
import { AnimatedNumber } from '../../lib/animated-number/types'
import { Vector } from '../../lib/types'

const msPerFrame = 8 // 120 fps

// ----------------------
// style
// ----------------------
const Object = styled.div`
  width: 100px;
  height: 100px;
  position: fixed;
  top: 0;
  left: 0;
  background: green;
  :hover {
    cursor: grab;
  }
`

// ----------------------
// state model
// ----------------------

interface State {
  timeStamp: number
  lastUpdate: number
  fixPosition: Vector
  currentPositionX: AnimatedNumber
  currentPositionY: AnimatedNumber
  drag: boolean
  dragPosition: Vector
  onRest: boolean
}

const initState: State = {
  timeStamp: 0,
  lastUpdate: 0,
  fixPosition: { x: 300, y: 300 },
  currentPositionX: {
    current: 0,
    velocity: 0,
    lastIdealValue: 0,
    lastIdealVelocity: 0,
  },
  currentPositionY: {
    current: 0,
    velocity: 0,
    lastIdealValue: 0,
    lastIdealVelocity: 0,
  },
  drag: false,
  dragPosition: { x: 0, y: 0 },
  onRest: true,
}

// ----------------------
// action model
// ----------------------
const Tick = (tick: number) => ({
  type: 'TICK' as const,
  payload: tick,
})

const SetPosition = (position: Vector) => ({
  type: 'SET_POSITION' as const,
  payload: position,
})

const SetOnDrag = (onDrag: boolean, relativePosition?: Vector) => ({
  type: 'SET_ON_DRAG' as const,
  payload: { onDrag, relativePosition },
})

type Action =
  | ReturnType<typeof Tick>
  | ReturnType<typeof SetPosition>
  | ReturnType<typeof SetOnDrag>

// ----------------------
// update
// ----------------------
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TICK':
      const currentStepper = stepper(state.timeStamp)(state.lastUpdate)(
        msPerFrame
      )

      const newCurrentPositionX = currentStepper(
        spring(state.fixPosition.x, presents.wobbly)
      )(state.currentPositionX)

      const newCurrentPositionY = currentStepper(
        spring(state.fixPosition.y, presents.wobbly)
      )(state.currentPositionY)

      const newOnRest =
        isOnRest(state.fixPosition.x)(state.currentPositionX) &&
        isOnRest(state.fixPosition.y)(state.currentPositionY)

      return {
        ...state,
        timeStamp: action.payload,
        lastUpdate: state.timeStamp,
        currentPositionX: newCurrentPositionX,
        currentPositionY: newCurrentPositionY,
        onRest: newOnRest,
      }
    case 'SET_ON_DRAG':
      return {
        ...state,
        drag: action.payload.onDrag,
        dragPosition: action.payload.relativePosition ?? state.dragPosition,
        onRest: !state.drag,
        timeStamp: performance.now(),
        lastUpdate: performance.now(),
      }
    case 'SET_POSITION':
      return {
        ...state,
        currentPositionX: {
          current: action.payload.x - state.dragPosition.x,
          velocity: 0,
          lastIdealValue: action.payload.x - state.dragPosition.x,
          lastIdealVelocity: 0,
        },
        currentPositionY: {
          current: action.payload.y - state.dragPosition.y,
          velocity: 0,
          lastIdealValue: action.payload.y - state.dragPosition.y,
          lastIdealVelocity: 0,
        },
      }
  }
}

const Page: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initState)

  const elementRef = React.useRef<HTMLDivElement>(null)

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
    animationRef.current = requestAnimationFrame(step(0))
    return () => cancelAnimationFrame(animationRef.current)
  }, [step])

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const mousePosition: Vector = { x: e.x, y: e.y }
      if (state.drag) {
        dispatch(SetPosition(mousePosition))
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      const relativeMousePosition: Vector = { x: e.offsetX, y: e.offsetY }
      dispatch(SetOnDrag(true, relativeMousePosition))
    }

    const onMouseUp = () => {
      dispatch(SetOnDrag(false))
    }

    const element = elementRef.current

    element?.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      element?.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [state.drag])

  return (
    <>
      <Object
        ref={elementRef}
        style={{
          transform: `translate3d(${state.currentPositionX.current}px, ${state.currentPositionY.current}px, 0px)`,
          cursor: state.drag ? 'grabbing' : 'grab',
        }}
      />
    </>
  )
}

export default Page
