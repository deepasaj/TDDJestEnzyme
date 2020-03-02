import React, { createContext, useContext } from 'react';
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