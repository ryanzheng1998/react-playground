import React from 'react'

interface Props {}

const Page: React.FC<Props> = () => {
  const elementRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const element = elementRef.current

    const onMouseMove = (e: MouseEvent) => {
      const mousePosition = { x: e.x, y: e.y }
    }

    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div ref={elementRef}>
      <p>aa</p>
    </div>
  )
}

export default Page
