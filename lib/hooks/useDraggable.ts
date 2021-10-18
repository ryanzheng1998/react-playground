import React from 'react'
import { AnimatedNumber } from '../animated-number/types'
import { Vector } from '../types'
import { useAnimatedNumbers } from './useAnimatedNumbers'

const msPerFrame = 8 // 120 fps

// ----------------------
// state model
// ----------------------
interface State {
  fixPosition: Vector
  drag: boolean
  dragPosition: Vector
  originalPositionRelativeToViewPort: Vector
  currentScroll: Vector
}

// ----------------------
// action model
// ----------------------

// ----------------------
// update
// ---------------------

export const useDraggable = (
  destination: Vector,
  dep: React.DependencyList
) => {
  const [currentPositionX, currentPositionY] = useAnimatedNumbers([{}], [])
}
