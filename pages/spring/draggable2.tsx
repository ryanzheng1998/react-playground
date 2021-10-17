import React from 'react'
import styled from 'styled-components'
import Draggable from '../../components/Draggable'
import { Vector } from '../../lib/types'
import { vectorAdd } from '../../lib/vectorAdd'

const Container = styled.div`
  user-select: none;
`

const Object = styled.div`
  width: 100px;
  height: 100px;
  background: green;
`

const Page: React.FC = () => {
  const [wantedPosition, setWantedPosition] = React.useState<Vector>({
    x: 0,
    y: 0,
  })

  return (
    <Container>
      <Draggable destination={wantedPosition}>
        <Object />
      </Draggable>
      <button
        onClick={() =>
          setWantedPosition(vectorAdd(wantedPosition)({ x: 50, y: 50 }))
        }
      >
        fdsafdsa
      </button>
    </Container>
  )
}

export default Page
