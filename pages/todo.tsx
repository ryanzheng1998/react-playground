import React from 'react'

// ----------------------
// State Model
// ----------------------

interface Todo {
  active: boolean
  text: string
}

interface State {
  todoList: Todo[]
}

const initialState: State = {
  todoList: [],
}

// ----------------------
// action model
// ----------------------
const AddTodo = (text: string) => ({
  type: 'ADD_TODO' as const,
  payload: text,
})

const ToggleTodo = (index: number) => ({
  type: 'TOGGLE_TODO' as const,
  playload: index,
})

type Action = ReturnType<typeof AddTodo> | ReturnType<typeof ToggleTodo>

// ----------------------
// update
// ----------------------
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todoList: [
          ...state.todoList,
          {
            text: action.payload,
            active: true,
          },
        ],
      }
    case 'TOGGLE_TODO':
      return {
        ...state,
        todoList: state.todoList.map((value, index) =>
          index === action.playload
            ? { ...value, active: !value.active }
            : value
        ),
      }
  }
}

const Page: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const [inputText, setInputText] = React.useState('')

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          dispatch(AddTodo(inputText))
          setInputText('')
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </form>
      {state.todoList.map((value, index) => (
        <p
          key={index}
          style={{
            textDecoration: value.active ? '' : 'line-through',
            userSelect: 'none',
          }}
          onClick={() => dispatch(ToggleTodo(index))}
        >
          {value.text}
        </p>
      ))}
    </>
  )
}

export default Page
