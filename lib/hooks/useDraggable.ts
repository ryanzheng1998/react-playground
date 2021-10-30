import React from 'react'
import { Vector } from '../types'
import { vectorAdd } from '../vectorAdd'
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
  const [position, setPostiion] = React.useState<Vector>({ x: 0, y: 0 })
  const [{ drag, dragPosition }, setDrag] = React.useState({
    drag: false,
    dragPosition: { x: 0, y: 0 } as Vector,
  })
  const [
    originalPositionRelativeToViewPort,
    setOriginalPositionRelativeToViewPort,
  ] = React.useState<Vector>({
    x: 0,
    y: 0,
  })

  React.useEffect(() => {
    const element = ref.current
    const domRect = element?.getBoundingClientRect()

    setOriginalPositionRelativeToViewPort({
      x: domRect?.x ?? 0,
      y: domRect?.y ?? 0,
    })
  }, [])

  React.useEffect(() => {
    const element = ref.current

    const onMouseMove = (e: MouseEvent) => {
      if (drag) {
        const mousePagePosition: Vector = { x: e.pageX, y: e.pageY }
        const mouseViewportPosition: Vector = { x: e.x, y: e.y }
        const position1 = vectorSubtract(mousePagePosition)(dragPosition)
        const position2 = vectorSubtract(position1)(
          originalPositionRelativeToViewPort
        )
        setMousePosition(mouseViewportPosition)
        setPostiion(position2)
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      const relativeMousePosition: Vector = { x: e.offsetX, y: e.offsetY }
      setDrag({
        drag: true,
        dragPosition: relativeMousePosition,
      })
      const mouseViewportPosition: Vector = { x: e.x, y: e.y }
      setMousePosition(mouseViewportPosition)
    }

    const onMouseUp = () => {
      setDrag({
        drag: false,
        dragPosition: dragPosition,
      })
    }

    const onScroll = () => {
      if (drag) {
        const scroll: Vector = {
          x: window.scrollX,
          y: window.scrollY,
        }

        const newPosition = vectorAdd(mousePosition)(scroll)

        const newPosition2 = vectorSubtract(newPosition)(dragPosition)

        const newPosition3 = vectorSubtract(newPosition2)(
          originalPositionRelativeToViewPort
        )

        setPostiion(newPosition3)
      }
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
  }, [drag, dragPosition, mousePosition, originalPositionRelativeToViewPort])

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
