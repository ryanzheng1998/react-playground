import React from 'react'
import { spring } from '../../lib/animated-number/spring'
import { useAnimatedNumbers } from '../../lib/hooks/useAnimatedNumbers'
import { update } from '../../lib/update'

const Page: React.FC = () => {
  const max = 100

  const [target, setTarget] = React.useState(
    new Array(10).fill(0).map((x, i) => i)
  )

  const animatedNumbers = useAnimatedNumbers(
    target.map((x, i) => ({
      defaultStyle: 0,
      style: spring(x),
      onRest: () => {
        setTimeout(() => {
          // should use function here, otherwise the value will be momolize
          setTarget((x) => update(i)(max)(x))
        }, 1000 * i)
      },
    })),
    [target]
  )

  const numbers = animatedNumbers.map((x, i) => <p key={i}>{x.current}</p>)

  return (
    <>
      {numbers}
      <button onClick={() => setTarget(update(0)(max)(target))}>dafdsa</button>
    </>
  )
}

export default Page
