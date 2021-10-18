import React from 'react'

interface Props {}

const Page: React.FC<Props> = () => {
  const [state, setState] = React.useState(3)

  React.useEffect(() => {
    console.log(state)
  }, [state])
  return <></>
}

export default Page
