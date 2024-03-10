export type Action = (<T>(getState:(() => void), dispatch:Dispatch) => T | Promise<any>) | {
    type?:string
    payload?:any
}

export type Reducer = (state: any, action: Action) => void

export type ReducersObject = { [key: string]: Reducer }

export type Listener = () => void

export type Dispatch = (action:Action) => void | Promise<any>

export type Store = {
    getState: () => any
    dispatch: Dispatch
    subscribe: (listener:Listener) => () => void
}

// export type Dispatch = (action:Action) => void 

