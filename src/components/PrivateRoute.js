import React from 'react'
import { Redirect, Route } from 'react-router'
import { Container, Loader } from 'rsuite';
import { useProfile } from '../context/profile.context';

const PrivateRoute = ({ children, ...routeProps }) => {
    const { profile, loading } = useProfile();

    if (loading && !profile) {
        return (
            <Container>
                <Loader center vertical size='md' content='Loading' speed='slow' />
            </Container>
        )
    }

    if (!profile && !loading) {
        return <Redirect to='/sign-in' />
    }

    return (
        <Route {...routeProps} >
            {children}
        </Route>
    )
}

export default PrivateRoute