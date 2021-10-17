import React from 'react'
import styled from 'styled-components'
import { isOnRest } from '../lib/animated-number/isOnRest'
import presents from '../lib/animated-number/presents'
import { spring } from '../lib/animated-number/spring'
import { stepper } from '../lib/animated-number/stepper'
import { AnimatedNumber } from '../lib/animated-number/types'
import { Vector } from '../lib/types'
import { vectorSubtract } from '../lib/vectorSubtract'

interface Props {
  destination: Vector
  children: JSX.Element
}

const msPerFrame = 8 // 120 fps

// ----------------------
// style
// ----------------------
const Container = styled.div`
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
  originalPositionRelativeToViewPort: Vector
  currentScroll: Vector
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

const SetFixPosition = (position: Vector) => ({
  type: 'SET_FIX_POSITION' as const,
  payload: position,
})

const SetOriginalPositionRelativeToViewPort = (
  position: Vector,
  scroll: Vector
) => ({
  type: 'SET_ORIGINAL_POSITION_RELATIVE_TO_VIEW_PORT' as const,
  payload: { position, scroll },
})

type Action =
  | ReturnType<typeof Tick>
  | ReturnType<typeof SetPosition>
  | ReturnType<typeof SetOnDrag>
  | ReturnType<typeof SetFixPosition>
  | ReturnType<typeof SetOriginalPositionRelativeToViewPort>

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
        onRest: action.payload.onDrag,
        timeStamp: performance.now(),
        lastUpdate: performance.now(),
      }
    case 'SET_POSITION':
      if (!state.drag) return state

      const newX =
        action.payload.x -
        state.dragPosition.x -
        state.originalPositionRelativeToViewPort.x

      const newY =
        action.payload.y -
        state.dragPosition.y -
        state.originalPositionRelativeToViewPort.y

      return {
        ...state,
        currentPositionX: {
          current: newX,
          velocity: 0,
          lastIdealValue: newX,
          lastIdealVelocity: 0,
        },
        currentPositionY: {
          current: newY,
          velocity: 0,
          lastIdealValue: newY,
          lastIdealVelocity: 0,
        },
      }
    case 'SET_FIX_POSITION':
      return {
        ...state,
        fixPosition: action.payload,
        onRest: false,
      }
    case 'SET_ORIGINAL_POSITION_RELATIVE_TO_VIEW_PORT':
      if (!state.drag) {
        return {
          ...state,
          originalPositionRelativeToViewPort: vectorSubtract(
            action.payload.position
          )({
            x: state.currentPositionX.current,
            y: state.currentPositionY.current,
          }),
          currentScroll: action.payload.scroll,
        }
      }

      const newX2 =
        state.currentPositionX.current -
        state.currentScroll.x +
        action.payload.scroll.x

      const newY2 =
        state.currentPositionY.current -
        state.currentScroll.y +
        action.payload.scroll.y

      return {
        ...state,
        originalPositionRelativeToViewPort: vectorSubtract(
          action.payload.position
        )({
          x: state.currentPositionX.current,
          y: state.currentPositionY.current,
        }),
        currentPositionX: {
          current: newX2,
          velocity: 0,
          lastIdealValue: newX2,
          lastIdealVelocity: 0,
        },
        currentPositionY: {
          current: newY2,
          velocity: 0,
          lastIdealValue: newY2,
          lastIdealVelocity: 0,
        },
        currentScroll: action.payload.scroll,
      }
  }
}

const Draggable: React.FC<Props> = (p) => {
  const initState: State = {
    timeStamp: 0,
    lastUpdate: 0,
    fixPosition: p.destination,
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
    originalPositionRelativeToViewPort: {
      x: 0,
      y: 0,
    },
    currentScroll: { x: 0, y: 0 },
  }

  const [state, dispatch] = React.useReducer(reducer, initState)

  const elementRef = React.useRef<HTMLDivElement>(null)

  const animationRef = React.useRef(0)

  React.useEffect(() => {
    const element = elementRef.current
    if (element) {
      const rect = element.getBoundingClientRect()
      const position: Vector = {
        x: rect.x,
        y: rect.y,
      }
      const scroll: Vector = {
        x: window.scrollX,
        y: window.scrollY,
      }
      dispatch(SetOriginalPositionRelativeToViewPort(position, scroll))
    }

    const onScroll = () => {
      if (element) {
        const rect = element.getBoundingClientRect()
        const position: Vector = {
          x: rect.x,
          y: rect.y,
        }
        const scroll: Vector = {
          x: window.scrollX,
          y: window.scrollY,
        }
        dispatch(SetOriginalPositionRelativeToViewPort(position, scroll))
      }
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

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
    const element = elementRef.current

    const onMouseMove = (e: MouseEvent) => {
      const mousePosition: Vector = { x: e.x, y: e.y }
      dispatch(SetPosition(mousePosition))
    }

    const onMouseDown = (e: MouseEvent) => {
      const relativeMousePosition: Vector = { x: e.offsetX, y: e.offsetY }
      dispatch(SetOnDrag(true, relativeMousePosition))
    }

    const onMouseUp = () => {
      dispatch(SetOnDrag(false))
    }

    element?.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      element?.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  React.useEffect(() => {
    dispatch(SetFixPosition(p.destination))
  }, [p.destination])

  return (
    <Container
      ref={elementRef}
      style={{
        transform: `translate3d(${state.currentPositionX.current}px, ${state.currentPositionY.current}px, 0px)`,
        cursor: state.drag ? 'grabbing' : 'grab',
      }}
    >
      {p.children}
    </Container>
  )
}

export default Draggable
