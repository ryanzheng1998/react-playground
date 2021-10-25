import React from 'react'
import { Vector } from '../types'
import { vectorSubtract } from '../vectorSubtract'
import { useAnimationFrame } from './useAnimationFrame'

export const useDraggable = (): {
  ref: React.MutableRefObject<HTMLDivElement | null>
  position: Vector
  drag: boolean
} => {
  const ref = React.useRef<HTMLDivElement | null>(null)
  // this is for auto scroll
  const [mousePosition, setMousePosition] = React.useState<Vector>({
    x: 0,
    y: 0,
  })
  const [position, setPostiion] = React.useState<Vector>({ x: 110, y: 110 })
  const [{ drag, dragPosition }, setDrag] = React.useState({
    drag: false,
    dragPosition: { x: 0, y: 0 } as Vector,
  })

  React.useEffect(() => {
    const element = ref.current

    const onMouseMove = (e: MouseEvent) => {
      if (drag) {
        const mousePosition: Vector = { x: e.x, y: e.y }
        setMousePosition(mousePosition)
        setPostiion(vectorSubtract(mousePosition)(dragPosition))
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      const relativeMousePosition: Vector = { x: e.offsetX, y: e.offsetY }
      setDrag({
        drag: true,
        dragPosition: relativeMousePosition,
      })
      const mousePosition: Vector = { x: e.x, y: e.y }
      setMousePosition(mousePosition)
    }

    const onMouseUp = () => {
      setDrag({
        drag: false,
        dragPosition: dragPosition,
      })
    }

    element?.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      element?.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [drag, dragPosition])

  // auto scrolling but does not consider about skip frame
  const { setStopAnimationFrame } = useAnimationFrame(() => {
    if (!drag) {
      setStopAnimationFrame(true)
    }

    // auto scroll
    if (mousePosition.y > window.innerHeight - 10) {
      window.scrollBy(0, 15)
    }

    if (mousePosition.y < 10) {
      window.scrollBy(0, -15)
    }

    if (mousePosition.x > window.innerWidth - 10) {
      window.scrollBy(15, 0)
    }

    if (mousePosition.x < 10) {
      window.scrollBy(-15, 0)
    }
  }, [drag, mousePosition])

  return { ref, drag, position }
}
