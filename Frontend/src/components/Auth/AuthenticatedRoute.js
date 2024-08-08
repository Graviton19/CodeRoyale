import React from 'react';
import { Route } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthenticateBeforeRender from './AuthenticateBeforeRender';

const AuthenticatedRoute = ({ component: Component, exact, path }) => {
    const { isAuthenticated } = useAuth();

    return (
        <Route
            exact={exact}
            path={path}
            render={props =>
                isAuthenticated() ? (
                    <Component {...props} />
                ) : (
                    <AuthenticateBeforeRender render={() => <Component {...props} />} />
                )
            }
        />
    );
};

export default AuthenticatedRoute;
