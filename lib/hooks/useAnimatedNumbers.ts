import React from 'react'
import { isOnRest } from '../animated-number/isOnRest'
import { stepper } from '../animated-number/stepper'
import { AnimatedNumber, Spring } from '../animated-number/types'
import { AnimatedNumberConfig } from './useAnimatedNumber'
import { usePrevious } from './usePrevious'

const msPerFrame = 8 // 120 fps

// ----------------------
// state model
// ----------------------

interface State {
  timeStamp: number // in millisecond
  list: {
    style: Spring | number
    animatedNumber: AnimatedNumber
    onRest: boolean // computed value, store here for the sake of convenience and readablily
  }[]
}

// ----------------------
// action model
// ---------------------
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

          const newAnimatedNumber = stepper(action.payload)(state.timeStamp)(
            msPerFrame
          )(x.style)(x.animatedNumber)

          return {
            ...x,
            onRest: isOnRest(x.style.val)(newAnimatedNumber),
            animatedNumber: newAnimatedNumber,
          }
        }),
      }
    case 'SET_CONFIG':
      return {
        ...state,
        timeStamp: performance.now(),
        list: action.payload.map((x, i) => {
          if (state.list[i]) {
            return {
              ...state.list[i],
              style: x.style,
              onRest: (() => {
                if (typeof x.style === 'number') return true
                return isOnRest(x.style.val)(state.list[i].animatedNumber)
              })(),
            }
          }
          return {
            onRest: (() => {
              if (typeof x.style === 'number') return true
              return x.style.val === x.defaultStyle
            })(),
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const config = React.useMemo(() => animatedNumberConfigs, dep)

  React.useEffect(() => {
    dispatch(SetConfig(config))
  }, [config])

  const initState: State = {
    timeStamp: 0,
    list: config.map((x) => ({
      onRest: (() => {
        if (typeof x.style === 'number') return true
        return x.style.val === x.defaultStyle
      })(),
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

  const animatedRef = React.useRef(0)

  const everyThingOnRest = state.list.every((x) => x.onRest)

  const step = React.useCallback(
    (t1: number) => (t2: number) => {
      if (t2 - t1 > msPerFrame) {
        if (everyThingOnRest) {
          return
        }
        dispatch(Tick(t2))
        animatedRef.current = requestAnimationFrame(step(t2))
      } else {
        animatedRef.current = requestAnimationFrame(step(t1))
      }
    },
    [everyThingOnRest]
  )

  React.useEffect(() => {
    animatedRef.current = requestAnimationFrame(step(performance.now()))
    return () => cancelAnimationFrame(animatedRef.current)
  }, [step])

  const onRestList = state.list.map((x) => x.onRest)
  const previousOnRestList = usePrevious(onRestList)

  React.useEffect(() => {
    onRestList.map((x, i) => {
      if (
        x &&
        previousOnRestList?.[i] !== undefined &&
        !previousOnRestList[i]
      ) {
        config[i].onRest?.()
      }
    })
  }, [onRestList, config, previousOnRestList])

  return state.list.map((x) => x.animatedNumber)
}
