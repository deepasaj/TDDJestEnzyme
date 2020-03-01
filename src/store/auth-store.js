import React, { createContext, useContext } from 'react';
import axios from "axios";

export const Store = createContext();

export class AuthAPI {
  constructor(auth) {
    this.auth = auth;
  }

  get = async (url, options) => {
    return axios.get(url, await this.buildAuthOptions(options));
  }

  buildAuthOptions = async (options) => {
    const accessToken = await this.auth.getAccessToken();
    const headers = {...options.headers};
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }
    return {
      ...options,
      headers
    };
  }
}

export const AuthStoreProvider = props => {
  return (
    <Store.Provider
      value={new AuthAPI(props.auth)}
    >
      {props.children}
    </Store.Provider>
  );
}

export const useAuthAPI = () => useContext(Store);