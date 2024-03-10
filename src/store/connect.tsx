import React, { useEffect, useState} from 'react'

import { Store } from '../mini-redux/Types'
import { MapStateToProps, MapDispatchToProps } from './Types'



export default function createConnect(store:Store) {
    return function connect(
        mapStateToProps:MapStateToProps = null,
        mapDispatchToProps:MapDispatchToProps = null
    ) {
        return function wrapper(ChildComponent:React.FC<any>) {

            return function WrapperComponent(props:any) {
                const [state, setState] = useState({...store.getState()})

                useEffect(() => store.subscribe(() => setState({...store.getState()})), [store])

                const propsFromState = mapStateToProps ? mapStateToProps(state) : null
                const propsFromDispatch = mapDispatchToProps ? mapDispatchToProps(store.dispatch) : null

                const ownProps = {
                    ...props,
                    ...propsFromState,
                    ...propsFromDispatch
                }

                
                return <ChildComponent {...ownProps} />
                    
            }
        }
    }
}