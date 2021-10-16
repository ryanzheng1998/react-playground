import React from 'react'
import styled from 'styled-components'
import { spring } from '../../lib/animated-number/spring'
import { useAnimatedNumber } from '../../lib/hooks/useAnimatedNumber'

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
  const [target, setTarget] = React.useState(1)

  const animatedOpacity = useAnimatedNumber(
    {
      defaultStyle: 0,
      style: spring(target),
      onRest: () => {
        setTarget(target === 0 ? 1 : 0)
      },
    },
    [target]
  )

  return (
    <Container>
      <Text style={{ opacity: animatedOpacity.current }}>Hello</Text>
    </Container>
  )
}

export default Page
