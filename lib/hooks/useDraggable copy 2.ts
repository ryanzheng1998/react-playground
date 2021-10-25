import React from 'react'
import { spring } from 'react-motion'
import { AnimatedNumber } from '../animated-number/types'
import { Vector } from '../types'
import { vectorSubtract } from '../vectorSubtract'
import { useAnimatedNumbers } from './useAnimatedNumbers'

export const useDraggable = (
  destination: Vector,
  dep: React.DependencyList
): {
  onDrag: boolean
  animatedPositionX: AnimatedNumber
  animatedPositionY: AnimatedNumber
  ref: React.RefObject<HTMLDivElement>
} => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoDestination = React.useMemo(() => destination, dep)
  const [drag, setDrag] = React.useState(false)
  const [mousePosition, setMousePosition] = React.useState<Vector>({
    x: 0,
    y: 0,
  })
  const [mouseOnElementOffset, setMouseOnElementOffset] =
    React.useState<Vector>({ x: 0, y: 0 })
  const [currentPositionX, currentPositionY] = useAnimatedNumbers(
    [
      {
        defaultStyle: 0,
        style: spring(memoDestination.x),
      },
      {
        defaultStyle: 0,
        style: spring(memoDestination.y),
      },
    ],
    [memoDestination]
  )

  const elementRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (drag) {
        setMousePosition({ x: e.x, y: e.y })
      }
    }

    const onMouseUp = () => {
      setDrag(false)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [drag])

  React.useEffect(() => {
    const element = elementRef.current

    const onMouseDown = (e: MouseEvent) => {
      setDrag(true)
      setMouseOnElementOffset({ x: e.offsetX, y: e.offsetY })
    }

    element?.addEventListener('mousedown', onMouseDown)

    return () => {
      element?.addEventListener('mousedown', onMouseDown)
    }
  }, [elementRef])

  if (drag) {
    const newPosition = mousePosition
    // const newPosition = vectorSubtract(mousePosition)(mouseOnElementOffset)

    return {
      onDrag: drag,
      animatedPositionX: {
        current: newPosition.x,
        velocity: 0,
        lastIdealValue: newPosition.x,
        lastIdealVelocity: 0,
      },
      animatedPositionY: {
        current: newPosition.y,
        velocity: 0,
        lastIdealValue: newPosition.y,
        lastIdealVelocity: 0,
      },
      ref: elementRef,
    }
  }

  return {
    onDrag: false,
    animatedPositionX: currentPositionX,
    animatedPositionY: currentPositionY,
    ref: elementRef,
  }
}
