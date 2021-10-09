import React from 'react'

export const useAnimation = (callback: (t: number) => void, dep: []): void => {
  const animationRef = React.useRef(0)

  const step = React.useCallback(
    (t1: number) => (t2: number) => {
      const resolution = 8 // 120 fps
      if (t2 - t1 > resolution) {
        callback(t2)
        animationRef.current = requestAnimationFrame(step(t2))
      } else {
        animationRef.current = requestAnimationFrame(step(t1))
      }
    },
    [callback]
  )

  React.useEffect(() => {
    animationRef.current = requestAnimationFrame(step(0))
    return () => cancelAnimationFrame(animationRef.current)
  }, [step, dep])

  return
}
