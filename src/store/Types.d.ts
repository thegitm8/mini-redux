import { Dispatch } from "../mini-redux/Types"

export type Todo = {
    id: string
    text: string
    completed: boolean
}

export type State = {
    todos: Todo[]
    visibilityFilter: string
    pokemon: any[]
}

type MapStateToProps = ((state:State) => { [key: string]: any; }) | null

type MapDispatchToProps = ((dispatch:Dispatch) => { [key: string]: (...args: any[]) => void }) | null