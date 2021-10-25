import React from 'react'
import { Motion } from 'react-motion'
import { spring } from '../../lib/animated-number/spring'
import { useAnimatedNumber } from '../../lib/hooks/useAnimatedNumber'

const Page: React.FC = () => {
  const max = 10

  const [target, setTarget] = React.useState(1)

  const animatedNumber = useAnimatedNumber(
    {
      defaultStyle: 0,
      style: spring(target),
      onRest: () => {
        console.log('on rest triggered')
        setTimeout(() => {
          setTarget(target === max ? 0 : max)
        }, 2000)
      },
    },
    [target]
  )

  return (
    <>
      <Motion defaultStyle={{ x: 0 }} style={{ x: spring(target) }}>
        {(value) => <p>Animated Number: {value.x}</p>}
      </Motion>
      <p>Animated Number: {animatedNumber.current}</p>
    </>
  )
}

export default Page
