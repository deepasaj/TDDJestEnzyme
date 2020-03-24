import React, { createContext, useContext, useReducer, useEffect, Fragment } from 'react';
import axios from 'axios';
import { API_URL, API_DEFAULT_TIMEOUT } from 'config';

export const Store = createContext();

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_DEFAULT_TIMEOUT
})

export class AuthAPI {
  constructor(auth) {
    this.auth = auth;
  }
  get = async (path, options) => {
    return axiosInstance.get(path, await this.buildAuthOptions(options));
  }
  post = async (path, data, options) => {
    return axiosInstance.post(path, data, await this.buildAuthOptions(options));
  }
  delete = async (path, options) => {
    return axiosInstance.delete(path, await this.buildAuthOptions(options));
  }
  patch = async (path, data, options) => {
    return axiosInstance.patch(path, data, await this.buildAuthOptions(options));
  }
  fetch = async (path, options) => {
    const url = `${API_URL}${path}`
    return window.fetch(url, await this.buildAuthOptions(options));
  }
  buildAuthOptions = async (options) => {
    const accessToken = await this.auth.getAccessToken();
    const headers = options && options.headers ? options.headers : {};
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }
    return {
      ...options,
      headers
    };
  }
}


const getInitialState = (auth) => {
  return {
    auth,
    isAuthenticated: false,
    authAPI: new AuthAPI(auth),
    user: {}
  };
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: {} };
    default:
      return state;
  }
}

export const AuthDectector = props => {
  const auth = useAuth();
  const authAPI = useAuthAPI();

  const [state, dispatch] = useStateValue();
  useEffect(() => {
    // check for authentication
    const checkAuthentication = async () => {
      const authenticated = await auth.isAuthenticated();
      if (!state.isAuthenticated && authenticated) {
        // detected the authenticated
        const user = (await authAPI.get('/auth/me')).data;
        user.avatar = `https://ui-avatars.com/api/?rounded=true&name=${user.display_name}`
        return dispatch({
          type: "AUTHENTICATED",
          payload: user
        });
      }
    };
    checkAuthentication();
  });
  return (
    <Fragment>
      {props.children}
    </Fragment>
  );
}

export const AuthStoreProvider = props => {
  const initState = getInitialState(props.auth);
  return (
    <Store.Provider
      value={useReducer(reducer, initState)}
    >
      <AuthDectector>
        {props.children}
      </AuthDectector>
    </Store.Provider>
  );
}

export const useAuthAPI = () => {
  const [state] = useContext(Store);
  return state.authAPI;
}

export const useAuth = () => {
  const [state] = useContext(Store);
  return state.auth;
}

export const useUser = () => {
  const [state] = useContext(Store);
  return state.user;
}

export const useStateValue = () => useContext(Store);