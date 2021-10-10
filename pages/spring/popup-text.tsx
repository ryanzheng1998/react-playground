import React from 'react'
import styled from 'styled-components'
import { spring } from '../../lib/animated-number/spring'
import { useAnimatedNumber } from '../../lib/sideEffect/useAnimatedNumber'

const Container = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 100%;
  user-select: none;
`

const Text = styled.h1`
  font-size: 50px;
`

const Page: React.FC = () => {
  const animatedOpacity = useAnimatedNumber({
    default: 0,
    spring: spring(200),
  })

  console.log(animatedOpacity.current)

  return (
    <Container>
      <Text style={{ opacity: animatedOpacity.current }}>Hello</Text>
    </Container>
  )
}

export default Page
