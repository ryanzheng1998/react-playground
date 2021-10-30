import React from 'react'
import presents from '../animated-number/presents'
import { spring } from '../animated-number/spring'
import { AnimatedNumber, Spring } from '../animated-number/types'
import { Vector } from '../types'

const msPerframe = 8 // 120 fps
const springCofig = presents.stiff

// ----------------------
// state model
// ----------------------
interface State {
  timeStamp: number // in millisecond
  dragPosition: Vector
  mousePosition: Vector // relative to viewport
  scrollPosition: Vector
  list: {
    originalPositionRelativeToViewPort: Vector
    animatedNumberX: AnimatedNumber
    animatedNumberY: AnimatedNumber
    styleX: Spring
    styleY: Spring
    drag: boolean
  }[]
}

// ----------------------
// action model
// ---------------------
const Tick = (tick: number) => ({
  type: 'TICK' as const,
  payload: tick,
})

const SetDestinations = (destinations: Vector[]) => ({
  type: 'SET_DESTINATION' as const,
  payload: destinations,
})

const SetMousePosition = (position: Vector) => ({
  type: 'SET_MOUSE_POSITION' as const,
  payload: position,
})

const StartDrag = (
  index: number,
  dragPosition: Vector,
  mousePosition: Vector
) => ({
  type: 'START_DRAG' as const,
  payload: { index, dragPosition, mousePosition },
})

const CancelDrag = () => ({
  type: 'CANCEL_DRAG' as const,
})

const SetScroll = (scrollPosition: Vector) => ({
  type: 'SET_SCROLL' as const,
  payload: scrollPosition,
})

const SetOrigianlPositionRelativeToViewPort = (
  index: number,
  position: Vector
) => ({
  type: 'SET_ORIGINAL_POSITION_RELATIVE_TO_VIEW_PORT' as const,
  payload: { position, index },
})

type Action =
  | ReturnType<typeof Tick>
  | ReturnType<typeof SetDestinations>
  | ReturnType<typeof SetMousePosition>
  | ReturnType<typeof StartDrag>
  | ReturnType<typeof CancelDrag>
  | ReturnType<typeof SetScroll>
  | ReturnType<typeof SetOrigianlPositionRelativeToViewPort>

// ----------------------
// update
// ----------------------
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
  }
}

export const useDraggablesWithDestination = (
  destinations: Vector[],
  dep: React.DependencyList
): {
  refs: React.MutableRefObject<(HTMLDivElement | null)[]>
  list: {
    position: Vector
    drag: boolean
  }[]
} => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoDestinations = React.useMemo(() => destinations, dep)

  const refs = React.useRef<(HTMLDivElement | null)[]>(
    memoDestinations.map(() => null)
  )

  const initState: State = {
    timeStamp: 0,
    dragPosition: { x: 0, y: 0 },
    mousePosition: { x: 0, y: 0 },
    scrollPosition: { x: 0, y: 0 },
    list: memoDestinations.map((v) => ({
      originalPositionRelativeToViewPort: { x: 0, y: 0 },
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
      drag: false,
      styleX: spring(v.x, springCofig),
      styleY: spring(v.y, springCofig),
    })),
  }

  const [state, dispatch] = React.useReducer(reducer, initState)

  React.useEffect(() => {
    dispatch(SetDestinations(memoDestinations))
  }, [memoDestinations])

  // init
  React.useEffect(() => {
    const scroll: Vector = {
      x: window.scrollX,
      y: window.scrollY,
    }

    dispatch(SetScroll(scroll))

    const elements = refs.current
  })
}
