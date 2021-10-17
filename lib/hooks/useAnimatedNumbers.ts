import React, { useDebugValue } from 'react'
import { isOnRest } from '../animated-number/isOnRest'
import { stepper } from '../animated-number/stepper'
import { AnimatedNumber, Spring } from '../animated-number/types'
import { usePrevious } from './usePrevious'

export interface AnimatedNumberConfig {
  onRest?: () => void
  defaultStyle: number
  style: Spring | number
}

const msPerFrame = 8 // 120 fpc

// ----------------------
// state model
// ----------------------

interface State {
  timeStamp: number
  lastUpdate: number
  list: {
    onRest: boolean
    style: Spring | number
    animatedNumber: AnimatedNumber
  }[]
}

// ----------------------
// action model
// ----------------------
const Tick = (tick: number) => ({
  type: 'TICK' as const,
  payload: tick,
})

const SetConfig = (config: AnimatedNumberConfig[]) => ({
  type: 'SET_CONFIG' as const,
  payload: config,
})

type Action = ReturnType<typeof Tick> | ReturnType<typeof SetConfig>

// ----------------------
// update
// ----------------------
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TICK':
      return {
        ...state,
        timeStamp: action.payload,
        lastUpdate: state.timeStamp,
        list: state.list.map((x) => {
          if (typeof x.style === 'number') {
            return {
              ...x,
              onRest: true,
              animatedNumber: {
                current: x.style,
                velocity: 0,
                lastIdealValue: x.style,
                lastIdealVelocity: 0,
              },
            }
          }

          const newAnimatedNumber = stepper(state.timeStamp)(state.lastUpdate)(
            msPerFrame
          )(x.style)(x.animatedNumber)

          return {
            ...x,
            onRest: isOnRest(x.style.val)(x.animatedNumber),
            animatedNumber: newAnimatedNumber,
          }
        }),
      }

    case 'SET_CONFIG':
      return {
        ...state,
        timeStamp: performance.now(),
        lastUpdate: performance.now(),
        list: action.payload.map((x, i) => {
          if (state.list[i]) {
            return {
              ...state.list[i],
              style: x.style,
              onRest: typeof x.style === 'number',
            }
          }
          return {
            onRest: false,
            style: x.style,
            animatedNumber: {
              current: x.defaultStyle,
              velocity: 0,
              lastIdealValue: x.defaultStyle,
              lastIdealVelocity: 0,
            },
          }
        }),
      }
  }
}

export const useAnimatedNumbers = (
  animatedNumberConfigs: AnimatedNumberConfig[],
  dep: React.DependencyList
): AnimatedNumber[] => {
  const config = React.useMemo(() => animatedNumberConfigs, dep)

  React.useEffect(() => {
    dispatch(SetConfig(config))
    dispatch(Tick(performance.now()))
  }, [config])

  const initState: State = {
    timeStamp: 0,
    lastUpdate: 0,
    list: config.map((x) => ({
      onRest: false,
      style: x.style,
      animatedNumber: {
        current: x.defaultStyle,
        velocity: 0,
        lastIdealValue: x.defaultStyle,
        lastIdealVelocity: 0,
      },
    })),
  }

  const [state, dispatch] = React.useReducer(reducer, initState)

  const animationRef = React.useRef(0)

  const everyThingOnRest = state.list.every((x) => x.onRest)

  const step = React.useCallback(
    (t1: number) => (t2: number) => {
      if (t2 - t1 > msPerFrame) {
        if (everyThingOnRest) {
          return
        }

        dispatch(Tick(t2))
        animationRef.current = requestAnimationFrame(step(t2))
      } else {
        animationRef.current = requestAnimationFrame(step(t1))
      }
    },
    [everyThingOnRest]
  )

  React.useEffect(() => {
    animationRef.current = requestAnimationFrame(step(0))
    return () => cancelAnimationFrame(animationRef.current)
  }, [step])

  const onRestList = state.list.map((x) => x.onRest)

  const previousOnRestList = usePrevious(onRestList)

  React.useEffect(() => {
    onRestList.map((x, i) => {
      if (previousOnRestList !== undefined && !previousOnRestList[i] && x) {
        config[i].onRest?.()
      }
    })
  }, [onRestList, config, previousOnRestList])

  return state.list.map((x) => x.animatedNumber)
}
