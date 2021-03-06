import React from 'react'
import styled from 'styled-components'
import { useAnimationFrame } from '../lib/hooks/useAnimationFrame'
import { Vector } from '../lib/types'
import { vectorSubtract } from '../lib/vectorSubtract'

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

const Page: React.FC = () => {
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

  return (
    <>
      <Object
        ref={ref}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0px)`,
          cursor: drag ? 'grabbing' : 'grab',
        }}
      />
      <div style={{ userSelect: 'none' }}>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
        <p>fdjsaofjdsoiajfiosV</p>
      </div>
    </>
  )
}

export default Page
