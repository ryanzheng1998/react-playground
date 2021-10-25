import React from 'react'
import styled from 'styled-components'
import { useDraggable } from '../lib/hooks/useDraggable'

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
  const { ref, position, drag } = useDraggable()

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
