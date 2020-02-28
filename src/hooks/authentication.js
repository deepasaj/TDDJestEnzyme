import { useState } from 'react'
import authenticationService from 'services/authentication';
import { useStateValue } from 'store/store';

export const useLogin = () => {
  const [{isAuthenticated}, dispatch] = useStateValue();
  const [authError, setAuthError] = useState("");

  const login = async (username, password) => {
    const resp = await authenticationService.login(username, password);

    if (resp && !resp.error) {
      localStorage.setItem('token', JSON.stringify(resp.data.token));
      localStorage.setItem('user', JSON.stringify(resp.data.user));
      return dispatch({
        type: "LOGIN",
        payload: resp.data,
      });
    } else {
      setAuthError('Invalid Username/Password.');
    }
  }

  return [isAuthenticated, authError, login]
}

export const useLogout = () => {
  const [{isAuthenticated}, dispatch] = useStateValue()

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return dispatch({
      type: "LOGOUT",
    });
  }

  return [isAuthenticated, logout]
}
