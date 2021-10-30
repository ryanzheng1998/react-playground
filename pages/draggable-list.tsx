import React from 'react'
import styled from 'styled-components'
import { useDrggables } from '../lib/hooks/useDraggables'

interface Props {}

const Container = styled.div`
  position: relative;
  padding: 100px;

  p {
    margin: 0px;
  }
`

const Object = styled.div`
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0px;
  left: 0px;
  background: green;
  :hover {
    cursor: grab;
  }
`

const Page: React.FC<Props> = () => {
  const [elementCount, setElementCount] = React.useState(4)

  const { refs, list } = useDrggables(elementCount)

  const elements = list.map((value, index) => {
    return (
      <Object
        key={index}
        ref={(el) => (refs.current[index] = el)}
        style={{
          transform: `translate3d(${value.position.x}px, ${value.position.y}px, 0px)`,
          cursor: value.drag ? 'grabbing' : 'grab',
        }}
      />
    )
  })

  console.log(list)

  return (
    <>
      <div>
        <h1>fdafdsfa</h1>
      </div>
      <Container>
        {elements}
        <button onClick={() => setElementCount((x) => x + 1)}>fjadjf</button>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
        <p>fdasfdsafsdaf</p>
      </Container>
    </>
  )
}

export default Page
