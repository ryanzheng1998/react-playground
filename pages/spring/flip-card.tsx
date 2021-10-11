import React from 'react'
import styled from 'styled-components'
import { spring } from '../../lib/animated-number/spring'
import { useAnimatedNumber } from '../../lib/sideEffect/useAnimatedNumber'

const Container = styled.div`
  display: grid;
  height: 80vh;
  width: 100%;
  justify-content: center;
  align-items: center;
  user-select: none;
`

const CardContainer = styled.div`
  position: relative;
`

const CardBase = styled.div`
  width: 300px;
  height: 100px;
  position: absolute;
  left: calc(50% - 150px);
  top: calc(50% - 50px);

  will-change: transform, opacity;
  :hover {
    cursor: pointer;
  }
`

const Card1 = styled(CardBase)`
  background: red;
`

const Card2 = styled(CardBase)`
  background: green;
`

const ContentContainer = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  p {
    text-align: center;
    font-size: 30px;
  }
`

const Page: React.FC = () => {
  const [flip, setFlip] = React.useState(false)

  const animatedDegree = useAnimatedNumber(
    { defaultStyle: 0, style: spring(flip ? 180 : 0) },
    [flip]
  )

  const animatedOpacity = useAnimatedNumber(
    { defaultStyle: 0, style: spring(flip ? 1 : 0) },
    [flip]
  )

  console.log(animatedDegree.current)

  return (
    <Container onClick={() => setFlip(!flip)}>
      <CardContainer>
        <Card1
          style={{
            opacity: animatedOpacity.current,
            transform: `perspective(600px) rotateX(${
              animatedDegree.current - 180
            }deg)`,
          }}
        >
          <ContentContainer>
            <p>Card1</p>
          </ContentContainer>
        </Card1>
        <Card2
          style={{
            opacity: 1 - animatedOpacity.current,
            transform: `perspective(600px) rotateX(${animatedDegree.current}deg)`,
          }}
        >
          <ContentContainer>
            <p>Card2</p>
          </ContentContainer>
        </Card2>
      </CardContainer>
    </Container>
  )
}

export default Page
