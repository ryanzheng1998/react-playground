import React from 'react'
import { spring } from '../../lib/animated-number/spring'
import { useAnimatedNumber } from '../../lib/hooks/useAnimatedNumber'

const Page: React.FC = () => {
  const max = 100

  const [target, setTarget] = React.useState(0)

  const animatedNumber = useAnimatedNumber(
    {
      defaultStyle: 0,
      style: spring(target),
      onRest: () => {
        setTimeout(() => {
          setTarget(target === max ? 0 : max)
        }, 2000)
      },
    },
    [target]
  )

  return (
    <>
      <p>{animatedNumber.current}</p>
    </>
  )
}

export default Page
