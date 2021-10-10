import React from 'react'
import { Motion } from 'react-motion'
import { spring } from '../../lib/animated-number/spring'

interface Props {}

const Page: React.FC<Props> = () => {
  const [target, setTarget] = React.useState(10)

  return (
    <>
      <Motion
        defaultStyle={{ x: 0 }}
        style={{ x: spring(target) }}
        onRest={() => {
          setTimeout(() => {
            setTarget(target === 10 ? 0 : 10)
          }, 2000)
        }}
      >
        {(value) => <p>{value.x}</p>}
      </Motion>
    </>
  )
}

export default Page
