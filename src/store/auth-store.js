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
  post = async (url, data, options) => {
    return axios.post(url, data, await this.buildAuthOptions(options));
  }
  delete = async (url, options) => {
    return axios.delete(url, await this.buildAuthOptions(options));
  }
  patch = async (url, data, options) => {
    return axios.patch(url, data, await this.buildAuthOptions(options));
  }
  fetch = async (url, options) => {
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