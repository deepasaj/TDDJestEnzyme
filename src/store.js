import React, { createContext, useContext, useReducer } from 'react';

export const Store = createContext();

const getInitialState = () => {
  // try loading user and token from state
  const user = JSON.parse(localStorage.getItem('user') || null);
  const token = JSON.parse(localStorage.getItem('token') || null);
  let isAuthenticated = false;

  if (token) {
    isAuthenticated = true;
  }

  return {
    isAuthenticated,
    user,
    token,
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, token: action.payload, isAuthenticated: true };
    case "LOGOUT":
      return { ...state, token: null, isAuthenticated: false };
    case "FETCH_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

export const StoreProvider = props => {
  const initialState = getInitialState();
  return (
    <Store.Provider
      value={useReducer(reducer, initialState)}
    >
      {props.children}
    </Store.Provider>
  );
}

export const useStateValue = () => useContext(Store);