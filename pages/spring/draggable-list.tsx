import React from 'react'
import styled from 'styled-components'
import Draggable from '../../components/Draggable'
import { Vector } from '../../lib/types'

const Container = styled.div`
  user-select: none;
`

const ListWapper = styled.div`
  position: relative;
  display: grid;
  justify-content: center;
  /* height: 80vh; */
`

const Item = styled.div`
  position: absolute;
  top: 0;
  height: 0;
  width: 100px;
  height: 40px;
  background: green;

  p {
    margin: 0;
  }
`

const content = ['Item1', 'Item2', 'Item3', 'Item4']

const Page: React.FC = () => {
  const [order, setOrder] = React.useState(
    new Array(content.length).fill(0).map((x, i) => i)
  )

  const list = content.map((value, index) => {
    const destination: Vector = {
      x: 0,
      y: order[index] * 20,
    }

    return (
      <Draggable key={index} destination={destination}>
        <Item key={index}>
          <p>{value}</p>
        </Item>
      </Draggable>
    )
  })

  return (
    <Container>
      <ListWapper>{list}</ListWapper>
    </Container>
  )
}

export default Page
