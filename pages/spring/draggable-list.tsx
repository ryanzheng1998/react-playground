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

const content = [
  {
    name: 'Item1',
    color: 'green',
  },
  {
    name: 'Item2',
    color: 'red',
  },
  {
    name: 'Item3',
    color: 'blue',
  },
  {
    name: 'Item4',
    color: 'yellow',
  },
]

const Page: React.FC = () => {
  const [order, setOrder] = React.useState(
    new Array(content.length).fill(0).map((x, i) => i)
  )

  const list = content.map((value, index) => {
    const destination: Vector = {
      x: 0,
      y: order[index] * 50,
    }

    return (
      <Draggable key={index} destination={destination}>
        <Item key={index} style={{ background: value.color }}>
          <p>{value.name}</p>
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
