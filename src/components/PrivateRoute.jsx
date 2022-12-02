import React from 'react'
import { Redirect, Route } from 'react-router'

const PrivateRoute = ({ children, ...routeProps }) => {
    const profile = false;
    const isLoading = false;

    if (!profile && !isLoading) {
        return <Redirect to='/sign-in' />
    }

    return (
        <Route {...routeProps} >
            {children}
        </Route>
    )
}

export default PrivateRoute