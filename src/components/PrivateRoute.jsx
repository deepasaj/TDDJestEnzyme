import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useStateValue } from "store/store";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const [state] = useStateValue();
  return (
    <Route {...rest} render={props => (
      state.isAuthenticated ?
        // authorised so return component
        <Component {...props} />
        :
        // not logged in so redirect to login page with the return url
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )      
    } />
  );
}