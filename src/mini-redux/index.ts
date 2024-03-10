import { Reducer, Action, Listener, ReducersObject } from './Types'


export function createStore(reducer:Reducer) {
    let state:any;
    let listeners:Array<Listener> = [];

    const getState = () => state

    const dispatch = (action:Action) => {
        console.log(action)
        if( !(action instanceof Function )) {
            state = reducer(state, action);
            listeners.forEach(listener => listener());
            return
        }

        action(getState, dispatch)
    }
    
    const subscribe = (listener:Listener) => {
        listeners.push(listener)

        return () => {
            listeners.filter(l => l !== listener)
            return
        }
    }

    dispatch({});

    return { getState, dispatch, subscribe };
}


export const combineReducers:(reducers:ReducersObject) => Reducer = (reducers) => {
    const smth:{[key: string]: Reducer|void} = {}

    return (state = {}, action) => {
        const keys = Object.keys(reducers)
        return keys.reduce((acc, next) => {
            acc[next] = reducers[next](state[next], action)
            return acc
        }, smth)
    }
};

