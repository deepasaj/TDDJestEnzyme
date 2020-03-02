import { Route } from 'react-router-dom';
import { ImplicitCallback } from '@okta/okta-react';
export const AuthCallbackRoute = ({ ...props }) => {
    return (
        <Route {...props} component={ImplicitCallback} />
    )
}