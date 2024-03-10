import { createStore, combineReducers } from "../mini-redux";
import { Reducer} from '../mini-redux/Types'
import createConnect from './connect'

import { Todo } from './Types'

const todos:Reducer = (state = [], { type, payload }) => {
    switch(type) {
        case 'ADD_TODO':
            return [
                ...state,
                {
                    id: payload.id,
                    text: payload.text,
                    completed: false
                }
            ]
        case 'DELETE_TODO':
            return state.filter((todo:Todo) => todo.id !== payload.id)
        case 'TOGGLE_TODO':
            return state.map((todo:Todo) => {
                if (todo.id !== payload.id) return todo

                return {
                    ...todo,
                    completed: !todo.completed
                }
            })
        default:
            return state
    }

}

const visibilityFilter:Reducer = (state='SHOW_ALL', { type, payload }) => {
    switch(type) {
        case 'SET_VISIBILITY_FILTER':
            return payload
        default:
            return state
    }
}

const pokemon:Reducer = (state=[], { type, payload }) => {
    switch(type) {
        case 'GET_POKEMON':
            return [...payload]
        default:
            return state
    }
}

const store = createStore(combineReducers({
    todos,
    visibilityFilter,
    pokemon
}))


export default createConnect(store)
