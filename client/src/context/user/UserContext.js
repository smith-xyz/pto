import React, { createContext, useReducer, useContext, useEffect } from 'react'
import Spinner from '../../components/Common/Spinner'
import { userReducer, initialState } from './UserReducer'
import { checkLoggedInUser } from './UserActions'

const UserStateContext = createContext()
const UserDispatchContext = createContext()

export const UserProvider = (props) => {
    const [state, dispatch] = useReducer(userReducer, initialState)

    useEffect(() => {
        checkLoggedInUser(dispatch)
            .then(res => res)
            .catch(err => err)
    }, [])

    return (
        <UserStateContext.Provider value={state}>
            <UserDispatchContext.Provider value={dispatch}>
                {state.isLoading? <Spinner /> : props.children}
            </UserDispatchContext.Provider>
        </UserStateContext.Provider>
    )
}

export const useUserState = () => {
    const context = useContext(UserStateContext)
    if (context === undefined) {
      throw new Error('useUserState must be used within a UserProvider')
    }
    return context
}

export const useUserDispatch = () => {
    const context = useContext(UserDispatchContext)
    if (context === undefined) {
      throw new Error('useUserDispatch must be used within a UserProvider')
    }
    return context
}