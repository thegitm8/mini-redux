import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import connect from './store'
import './App.css'

import { Dispatch } from './mini-redux/Types'
import { Todo, State } from './store/Types'


const Todo = connect(null, (dispatch:Dispatch) => ({
  deleteTodo: (id:number) => dispatch({ type: 'DELETE_TODO', payload: { id }}),
  toggleTodo: (id:number) => dispatch({ type: 'TOGGLE_TODO', payload: { id }})
}))(
function Todo({id, text, completed, toggleTodo, deleteTodo}) {
  return <li>
    <span style={{ textDecoration: completed ? 'line-through' : 'none' }} onClick={() => toggleTodo(id)}>{text}</span>
    {' '}
    <span style={{fontWeight: 'bold'}} onClick={() => deleteTodo(id)}>X</span>
  </li>
})


const FilterLink = connect(
    (state:State) => ({
      currentFilter: state.visibilityFilter
    }),
    (dispatch) => ({
      setFilter: (filter:string) => dispatch({ type: 'SET_VISIBILITY_FILTER', payload: filter})
    })
  )(
    function FilterLink({ filter, currentFilter, setFilter, children }) {
      if(filter === currentFilter) {
        return <span>{children}</span>
      }

      return <a href='#' onClick={(e) => {
        e.preventDefault()
        setFilter(filter)
      }}>
        {children}
      </a>
    }
  )

function Footer() {
  return <p>
    Show:
    {' '}
    <FilterLink filter='SHOW_ALL' >All</FilterLink>
    {' '}
    <FilterLink filter='SHOW_ACTIVE' >Active</FilterLink>
    {' '}
    <FilterLink filter='SHOW_COMPLETED' >Completed</FilterLink>
  </p>
}

const TodoList = connect((state:State) => ({
  todos: state.todos,
  filter: state.visibilityFilter
}))(
  function TodoList({ todos, filter }) {
    const getVisibleTodos = (todos:Todo[], filter:string) => {
      switch(filter) {
        case 'SHOW_ALL':
          return todos
        case 'SHOW_ACTIVE':
          return todos.filter(c => !c.completed)
        case 'SHOW_COMPLETED':
          return todos.filter(c => c.completed)
        default:
          return todos
      }
    }

    return <ul>
      {getVisibleTodos(todos, filter).map(({id, text, completed}:{ id:string, text:string, completed:boolean}) => (
        <Todo
          key={id}
          id={id} 
          text={text}
          completed={completed}
        />
      ))}
    </ul>
  }
)

const PokeShow = connect((state) => ({
  pokemon: state.pokemon
}), (dispatch) => ({
  getPokemon: () => dispatch(async (getState, dispatch) => {
    try {
      const pokemon = await fetch('https://pokeapi.co/api/v2/pokemon')
        .then(res => res.json())

        console.log(getState, dispatch)
      dispatch({ type: 'GET_POKEMON', payload: pokemon.results})
    } catch(err) {
      console.error(err)
    }
  })
}))(
  function PokeShow({ getPokemon, pokemon }) {
    useEffect(() => {
      getPokemon()
    }, [])
    return <>
      {JSON.stringify(pokemon)}
    </>
  }
)
// ##############################

const AddTodo = connect(null,
  (dispatch:Dispatch) => ({
    createTodo: (id:string, text:string) => dispatch({
      type: 'ADD_TODO',
        payload: {
        id,
        text
      }
    })
  }))
(
function AddTodo({ createTodo }) {
  const [input, setInput] = useState('')

  function addTodo(id:string, text:string) {
    createTodo(id, text)
    setInput('')
  }

  return <>
    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
    <button onClick={() => addTodo(nanoid(), input)}>Add</button>
  </>
})

function App() {
  return (
    <>
      <div className="card">
        <TodoList />
        <br />
        <AddTodo />
        <Footer />
      </div>
      <PokeShow />
    </>
  )
}

export default App
