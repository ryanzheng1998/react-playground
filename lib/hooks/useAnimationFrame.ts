import React from 'react'

const msPerFrame = 8 // 120 fps

export const useAnimationFrame = (
  callback: (t: number) => void,
  dep: React.DependencyList
): {
  setStopAnimationFrame: React.Dispatch<React.SetStateAction<boolean>>
} => {
  const [stopAnimationFrame, setStopAnimationFrame] = React.useState(false)

  const animationRef = React.useRef(0)

  React.useEffect(() => {
    setStopAnimationFrame(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dep)

  const step = React.useCallback(
    (t1: number) => (t2: number) => {
      if (t2 - t1 > msPerFrame) {
        if (stopAnimationFrame) {
          return
        }
        callback(t2)
        animationRef.current = requestAnimationFrame(step(t2))
      } else {
        animationRef.current = requestAnimationFrame(step(t1))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...dep, stopAnimationFrame]
  )

  React.useEffect(() => {
    animationRef.current = requestAnimationFrame(step(performance.now()))
    return () => cancelAnimationFrame(animationRef.current)
  }, [step])

  return {
    setStopAnimationFrame,
  }
}
