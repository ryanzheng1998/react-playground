import React from 'react'
import { Vector } from '../types'

// ----------------------
// state model
// ----------------------
interface State {
  listLength: number // computed value, store here for the readablity
  list: {
    originalPositionRelativeToPage: Vector
    tranlatePosition: Vector
    drag: boolean
  }[]
  mousePositionRelativeToTheElement: Vector
  mousePositionRelativeToViewPort: Vector
  scrollPosition: Vector
}

// ----------------------
// action model
// ---------------------
const SetMousePositionRelativeToViewPort = (position: Vector) => ({
  type: 'SET_MOUSE_POSITION_RELATIVE_TO_VIEW_PORT' as const,
  payload: position,
})

const StartDrag = (index: number, )