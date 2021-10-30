import React from 'react'
import { isOnRest } from '../animated-number/isOnRest'
import presents from '../animated-number/presents'
import { spring } from '../animated-number/spring'
import { stepper } from '../animated-number/stepper'
import { AnimatedNumber, Spring } from '../animated-number/types'
import { Vector } from '../types'
import { vectorAdd } from '../vectorAdd'
import { vectorSubtract } from '../vectorSubtract'
import { useAnimationFrame } from './useAnimationFrame'

const msPerFrame = 8 // 120 fps
const springCofig = presents.stiff

// ----------------------
// state model
// ----------------------
interface State {
  timeStamp: number // in millisecond
  styleX: Spring
  styleY: Spring
  animatedNumberX: AnimatedNumber
  animatedNumberY: AnimatedNumber
  onRest: boolean // computed value, store here for the sake of convenience and readablily
  mousePosition: Vector
  scrollPosition: Vector
  drag: boolean
  dragPosition: Vector
  originalPositionRelativeToPage: Vector
}

// ----------------------
// action model
// ---------------------
const Tick = (tick: number) => ({
  type: 'TICK' as const,
  payload: tick,
})

const SetDestination = (destination: Vector) => ({
  type: 'SET_DESTINATION' as const,
  payload: destination,
})

const SetMousePosition = (position: Vector) => ({
  type: 'SET_MOUSE_POSITION' as const,
  payload: position,
})

const SetScrollPosition = (position: Vector) => ({
  type: 'SET_SCROLL_POSITION' as const,
  payload: position,
})

const StartDrag = (dragPosition: Vector) => ({
  type: 'START_DRAG' as const,
  payload: dragPosition,
})

const CancelDrag = () => ({
  type: 'CANCEL_DRAG' as const,
})

const SetOriginalPositionRelativeToPage = (position: Vector) => ({
  type: 'SET_ORIGINAL_POSITION_RELATIVE_TO_PAGE' as const,
  payload: position,
})

type Action =
  | ReturnType<typeof Tick>
  | ReturnType<typeof SetDestination>
  | ReturnType<typeof SetMousePosition>
  | ReturnType<typeof SetScrollPosition>
  | ReturnType<typeof StartDrag>
  | ReturnType<typeof CancelDrag>
  | ReturnType<typeof SetOriginalPositionRelativeToPage>

// ----------------------
// update
// ----------------------
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TICK':
      // impossible to happen
      if (state.drag) return state

      const newAnimatedNumberX = stepper(action.payload)(state.timeStamp)(
        msPerFrame
      )(state.styleX)(state.animatedNumberX)

      const newAnimatedNumberY = stepper(action.payload)(state.timeStamp)(
        msPerFrame
      )(state.styleY)(state.animatedNumberY)

      return {
        ...state,
        timeStamp: action.payload,
        animatedNumberX: newAnimatedNumberX,
        animatedNumberY: newAnimatedNumberY,
        onRest:
          isOnRest(state.styleX.val)(newAnimatedNumberX) &&
          isOnRest(state.styleY.val)(newAnimatedNumberY),
      }
    case 'START_DRAG':
      return {
        ...state,
        drag: true,
        dragPosition: action.payload,
      }
    case 'CANCEL_DRAG':
      return {
        ...state,
        drag: false,
        onRest: false,
        timeStamp: performance.now(),
      }
    case 'SET_MOUSE_POSITION':
      const newPosition = vectorSubtract(action.payload)(state.dragPosition)
      const newPosition2 = vectorAdd(newPosition)(state.scrollPosition)
      const newPosition5 = vectorSubtract(newPosition2)(
        state.originalPositionRelativeToPage
      )

      return {
        ...state,
        mousePosition: action.payload,
        onRest: true,
        animatedNumberX: {
          current: newPosition5.x,
          velocity: 0,
          lastIdealValue: newPosition5.x,
          lastIdealVelocity: 0,
        },
        animatedNumberY: {
          current: newPosition5.y,
          velocity: 0,
          lastIdealValue: newPosition5.y,
          lastIdealVelocity: 0,
        },
      }
    case 'SET_DESTINATION':
      return {
        ...state,
        styleX: spring(action.payload.x, springCofig),
        styleY: spring(action.payload.y, springCofig),
        onRest: false,
        timeStamp: performance.now(),
      }
    case 'SET_SCROLL_POSITION':
      if (!state.drag) {
        return {
          ...state,
          scrollPosition: action.payload,
        }
      }

      const currentPosition = {
        x: state.animatedNumberX.current,
        y: state.animatedNumberY.current,
      }

      const newPosition3 = vectorSubtract(currentPosition)(state.scrollPosition)
      const newPosition4 = vectorAdd(newPosition3)(action.payload)

      return {
        ...state,
        scrollPosition: action.payload,
        onRest: true,
        animatedNumberX: {
          current: newPosition4.x,
          velocity: 0,
          lastIdealValue: newPosition4.x,
          lastIdealVelocity: 0,
        },
        animatedNumberY: {
          current: newPosition4.y,
          velocity: 0,
          lastIdealValue: newPosition4.y,
          lastIdealVelocity: 0,
        },
      }
    case 'SET_ORIGINAL_POSITION_RELATIVE_TO_PAGE':
      return {
        ...state,
        originalPositionRelativeToPage: action.payload,
      }
  }
}

export const useDraggableWithDestination = (
  destination: Vector,
  dep: React.DependencyList
): {
  ref: React.MutableRefObject<HTMLDivElement | null>
  position: Vector
  drag: boolean
} => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoDestination = React.useMemo(() => destination, dep)

  React.useEffect(() => {
    dispatch(SetDestination(memoDestination))
  }, [memoDestination])

  const initState: State = {
    timeStamp: 0,
    styleX: spring(memoDestination.x, springCofig),
    styleY: spring(memoDestination.y, springCofig),
    animatedNumberX: {
      current: 0,
      velocity: 0,
      lastIdealValue: 0,
      lastIdealVelocity: 0,
    },
    animatedNumberY: {
      current: 0,
      velocity: 0,
      lastIdealValue: 0,
      lastIdealVelocity: 0,
    },
    onRest: true,
    mousePosition: { x: 0, y: 0 },
    scrollPosition: { x: 0, y: 0 },
    drag: false,
    dragPosition: { x: 0, y: 0 },
    originalPositionRelativeToPage: { x: 0, y: 0 },
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

  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const scroll: Vector = {
      x: window.scrollX,
      y: window.scrollY,
    }

    dispatch(SetScrollPosition(scroll))

    const element = ref.current
    const rect = element?.getBoundingClientRect()

    const origianlPositionRelativeToViewPort = {
      x: rect?.x ?? 0,
      y: rect?.y ?? 0,
    }

    dispatch(
      SetOriginalPositionRelativeToPage(
        vectorAdd(origianlPositionRelativeToViewPort)(scroll)
      )
    )
  }, [])

  React.useEffect(() => {
    const element = ref.current

    const onMouseMove = (e: MouseEvent) => {
      if (state.drag) {
        const mousePosition: Vector = { x: e.x, y: e.y }
        dispatch(SetMousePosition(mousePosition))
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      const relativeMousePosition: Vector = { x: e.offsetX, y: e.offsetY }
      const mousePosition: Vector = { x: e.x, y: e.y }

      dispatch(StartDrag(relativeMousePosition))
      dispatch(SetMousePosition(mousePosition))
    }

    const onMouseUp = () => {
      dispatch(CancelDrag())
    }

    const onScroll = () => {
      const scroll: Vector = {
        x: window.scrollX,
        y: window.scrollY,
      }
      dispatch(SetScrollPosition(scroll))
    }

    element?.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      element?.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('scroll', onScroll)
    }
  }, [state.drag])

  // auto scrolling but does not consider about skip frame
  const { setStopAnimationFrame } = useAnimationFrame(() => {
    if (!state.drag) {
      setStopAnimationFrame(true)
    }

    // auto scroll
    if (state.mousePosition.y > window.innerHeight - 10) {
      window.scrollBy(0, 15)
    }

    if (state.mousePosition.y < 10) {
      window.scrollBy(0, -15)
    }

    if (state.mousePosition.x > window.innerWidth - 10) {
      window.scrollBy(15, 0)
    }

    if (state.mousePosition.x < 10) {
      window.scrollBy(-15, 0)
    }
  }, [state.drag, state.mousePosition])

  return {
    ref,
    drag: state.drag,
    position: {
      x: state.animatedNumberX.current,
      y: state.animatedNumberY.current,
    },
  }
}
