import { Vector } from '../types'
import React from 'react'
import { vectorAdd } from '../vectorAdd'
import { vectorSubtract } from '../vectorSubtract'
import { update } from '../update'
import { useAnimationFrame } from './useAnimationFrame'

// ----------------------
// state model
// ----------------------
interface State {
  list: {
    originalPositionRelativeToPage: Vector
    position: Vector // relative to page
    drag: boolean
  }[]
  dragPosition: Vector
  mousePosition: Vector // relative to viewport
  scrollPosition: Vector
}

// ----------------------
// action model
// ---------------------
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

const SetOriginalPositionRelativeToPage = (
  index: number,
  position: Vector
) => ({
  type: 'SET_ORIGINAL_POSITION_RELATIVE_TO_PAGE' as const,
  payload: { position, index },
})

const AddNewObject = () => ({
  type: 'ADD_NEW_OBJECT' as const,
})

const TrimArray = (length: number) => ({
  type: 'TRIM_ARRAY' as const,
  payload: length,
})

type Action =
  | ReturnType<typeof SetMousePosition>
  | ReturnType<typeof StartDrag>
  | ReturnType<typeof CancelDrag>
  | ReturnType<typeof SetScroll>
  | ReturnType<typeof SetOriginalPositionRelativeToPage>
  | ReturnType<typeof AddNewObject>
  | ReturnType<typeof TrimArray>

// ----------------------
// update
// ----------------------
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_MOUSE_POSITION':
      if (state.list.every((x) => !x.drag)) return state

      const mousePagePosition = vectorAdd(action.payload)(state.scrollPosition)
      const newPosition = vectorSubtract(mousePagePosition)(state.dragPosition)

      return {
        ...state,
        mousePosition: action.payload,
        list: state.list.map((v) => {
          if (!v.drag) return v
          const finalPosition = vectorSubtract(newPosition)(
            v.originalPositionRelativeToPage
          )

          return {
            ...v,
            position: finalPosition,
          }
        }),
      }
    case 'START_DRAG':
      const newPosition3 = vectorSubtract(action.payload.mousePosition)(
        action.payload.dragPosition
      )

      const newPosition4 = vectorSubtract(newPosition3)(
        state.list[action.payload.index].originalPositionRelativeToPage
      )

      const newPosition7 = vectorAdd(newPosition4)(state.scrollPosition)

      return {
        ...state,
        mousePosition: action.payload.mousePosition,
        dragPosition: action.payload.dragPosition,
        list: update(action.payload.index)({
          ...state.list[action.payload.index],
          drag: true,
          position: newPosition7,
        })(state.list),
      }
    case 'CANCEL_DRAG':
      return {
        ...state,
        list: state.list.map((x) => ({ ...x, drag: false })),
      }
    case 'SET_SCROLL':
      if (state.list.every((x) => !x.drag))
        return { ...state, scrollPosition: action.payload }

      const newPostion = vectorAdd(state.mousePosition)(action.payload)

      const newPosition2 = vectorSubtract(newPostion)(state.dragPosition)

      return {
        ...state,
        scrollPosition: action.payload,
        list: state.list.map((x) => {
          if (!x.drag) return x

          const newPosition6 = vectorSubtract(newPosition2)(
            x.originalPositionRelativeToPage
          )

          return {
            ...x,
            position: newPosition6,
          }
        }),
      }
    case 'SET_ORIGINAL_POSITION_RELATIVE_TO_PAGE':
      return {
        ...state,
        list: update(action.payload.index)({
          ...state.list[action.payload.index],
          originalPositionRelativeToPage: action.payload.position,
        })(state.list),
      }
    case 'TRIM_ARRAY':
      return {
        ...state,
        list: state.list.slice(0, action.payload),
      }
    case 'ADD_NEW_OBJECT':
      return {
        ...state,
        list: [
          ...state.list,
          {
            position: { x: 0, y: 0 },
            drag: false,
            originalPositionRelativeToPage: { x: 0, y: 0 },
          },
        ],
      }
  }
}

export const useDrggables = (
  number: number // this is not updatable
): {
  refs: React.MutableRefObject<(HTMLDivElement | null)[]>
  list: {
    position: Vector
    drag: boolean
  }[]
} => {
  const refs = React.useRef<(HTMLDivElement | null)[]>(
    new Array(number).fill(null)
  )

  const initState: State = {
    list: new Array(number).fill({
      position: { x: 0, y: 0 },
      drag: false,
      originalPositionRelativeToPage: { x: 0, y: 0 },
    }),
    dragPosition: { x: 0, y: 0 },
    mousePosition: { x: 0, y: 0 },
    scrollPosition: { x: 0, y: 0 },
  }

  const [state, dispatch] = React.useReducer(reducer, initState)

  React.useEffect(() => {
    const distance = number - state.list.length

    if (distance < 0) {
      dispatch(TrimArray(number))
      return
    }

    new Array(distance).fill(0).forEach(() => {
      dispatch(AddNewObject())
      refs.current = [...refs.current, null]
    })
  }, [number, state.list.length])

  // init
  React.useEffect(() => {
    const scroll: Vector = {
      x: window.scrollX,
      y: window.scrollY,
    }

    dispatch(SetScroll(scroll))

    const elements = refs.current

    elements.forEach((element, index) => {
      const domRect = element?.getBoundingClientRect()
      const position = {
        x: domRect?.x ?? 0,
        y: domRect?.y ?? 0,
      }

      const pagePosition = vectorAdd(position)(scroll)

      dispatch(SetOriginalPositionRelativeToPage(index, pagePosition))
    })
  }, [number])

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      dispatch(SetMousePosition({ x: e.x, y: e.y }))
    }

    const onMouseUp = () => {
      dispatch(CancelDrag())
    }

    const onScroll = () => {
      const scroll: Vector = {
        x: window.scrollX,
        y: window.scrollY,
      }

      dispatch(SetScroll(scroll))
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  React.useEffect(() => {
    const onMouseDown = (index: number) => (e: MouseEvent) => {
      e.preventDefault()

      const dragPosition: Vector = { x: e.offsetX, y: e.offsetY }
      const mousePosition: Vector = { x: e.x, y: e.y }

      dispatch(StartDrag(index, dragPosition, mousePosition))
    }

    const elements = refs.current

    const listenerFunctionPointers = elements.map((element, index) => {
      const listenerFunctionPointer = onMouseDown(index)
      element?.addEventListener('mousedown', listenerFunctionPointer)
      return listenerFunctionPointer
    })

    return () => {
      elements.forEach((element, index) => {
        element?.removeEventListener(
          'mousedown',
          listenerFunctionPointers[index]
        )
      })
    }
  }, [number])

  // auto scrolling but does not consider about skip frame
  const { setStopAnimationFrame } = useAnimationFrame(() => {
    if (state.list.every((x) => !x.drag)) {
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
  }, [state.list, state.mousePosition])

  return { refs, list: state.list }
}
