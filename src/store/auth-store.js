import React, { createContext, useContext, useReducer, useEffect, Fragment } from 'react';
import axios from 'axios';
import { API_URL } from 'config';

export const Store = createContext();

export class AuthAPI {
  constructor(auth) {
    this.auth = auth;
  }
  get = async (path, options) => {
    const url = `${API_URL}${path}`
    return axios.get(url, await this.buildAuthOptions(options));
  }
  post = async (path, data, options) => {
    const url = `${API_URL}${path}`
    return axios.post(url, data, await this.buildAuthOptions(options));
  }
  delete = async (path, options) => {
    const url = `${API_URL}${path}`
    return axios.delete(url, await this.buildAuthOptions(options));
  }
  patch = async (path, data, options) => {
    const url = `${API_URL}${path}`
    return axios.patch(url, data, await this.buildAuthOptions(options));
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
        user: action.payload.user
      };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: {} };
    default:
      return state;
  }
}

export const AuthDectector = props => {
  const auth = useAuth();
  const currentState = useState();
  useEffect(() => {
    // check for authentication
    const checkAuthentication = async () => {
      const authenticated = await auth.isAuthenticated();
      if (!currentState.isAuthenticated && authenticated) {
        // detected the authenticated
        console.log('detected authenticated');
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


export const useState = () => {
  const [state] = useContext(Store);
  return state;
}