import React from 'react'
import styled from 'styled-components'
import { useDraggable } from '../../lib/hooks/useDraggable'

const Object = styled.div`
  width: 100px;
  height: 100px;
  background: blue;
`

const Page: React.FC = () => {
  const { onDrag, animatedPositionX, animatedPositionY, ref } = useDraggable(
    {
      x: 0,
      y: 0,
    },
    []
  )

  return (
    <>
      <Object
        ref={ref}
        style={{
          transform: `translate3d(${animatedPositionX.current}px, ${animatedPositionY.current}px, 0px)`,
          cursor: onDrag ? 'grabbing' : 'grab',
        }}
      />
    </>
  )
}

export default Page
