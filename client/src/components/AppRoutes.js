import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useUserState } from '../context'
 
const AppRoutes = ({ component: Component, path, isPrivate, ...rest }) => {
    const userData = useUserState()
    
    return (
        <Route
            path={path}
            render={props => isPrivate && 
                !Boolean(userData.token)? (<Redirect to={{ pathname: "/login" }} />) : (<Component {...props} />)}
            {...rest}
        />
    )
}
 
export default AppRoutes