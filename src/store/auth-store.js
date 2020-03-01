import React, { createContext, useContext } from 'react';

export const Store = createContext();

export const AuthStoreProvider = props => {

  return (
    <Store.Provider
      value={props.auth}
    >
      {props.children}
    </Store.Provider>
  );
}

export const useAuth = () => useContext(Store);