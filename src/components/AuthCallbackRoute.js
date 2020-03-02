import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { ImplicitCallback } from '@okta/okta-react';
import { useAuth } from 'store/auth-store';

export const AuthCallbackRoute = ({ ...props }) => {
    const auth = useAuth();
    useEffect(() => {
        const checkAuthenticated = async() => {
            console.log(await auth.getAccessToken());
        }
        checkAuthenticated();
    });
    return (
        <Route {...props} component={ImplicitCallback} />
    )
}