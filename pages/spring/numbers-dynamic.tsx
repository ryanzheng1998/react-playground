import React from 'react'
import { spring } from 'react-motion'
import { useAnimatedNumbers } from '../../lib/hooks/useAnimatedNumbers'

const Page: React.FC = () => {
  const [list, setList] = React.useState<number[]>([1])

  const animatedNumbers = useAnimatedNumbers(
    list.map((x, i) => ({
      defaultStyle: 0,
      style: spring(x),
      onRest: () => {
        setList((x) => [...x, (i + 1) * (i + 1)])
      },
    })),
    [list]
  )

  const numbers = animatedNumbers.map((x, i) => <p key={i}>{x.current}</p>)

  return <>{numbers}</>
}

export default Page
