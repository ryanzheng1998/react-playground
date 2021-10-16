import React from 'react'
import styled from 'styled-components'
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
  const [position, setPostiion] = React.useState<Vector>({ x: 110, y: 110 })
  const [{ drag, dragPosition }, setDrag] = React.useState({
    drag: false,
    dragPosition: { x: 0, y: 0 } as Vector,
  })

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (drag) {
        const mousePosition: Vector = { x: e.x, y: e.y }
        setPostiion(vectorSubtract(mousePosition)(dragPosition))
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      const relativeMousePosition: Vector = { x: e.offsetX, y: e.offsetY }
      setDrag({
        drag: true,
        dragPosition: relativeMousePosition,
      })
    }

    const onMouseUp = () => {
      setDrag({
        drag: false,
        dragPosition: dragPosition,
      })
    }

    const element = ref.current

    element?.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      element?.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [drag, dragPosition])

  return (
    <>
      <Object
        ref={ref}
        style={{
          top: position.y,
          left: position.x,
          cursor: drag ? 'grabbing' : 'grab',
        }}
      />
    </>
  )
}

export default Page
