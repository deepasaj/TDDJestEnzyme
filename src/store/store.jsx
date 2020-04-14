import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import axios from 'axios';
import { API_URL, API_DEFAULT_TIMEOUT } from 'config';
import { useOktaAuth } from '@okta/okta-react';

export const User = createContext();

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_DEFAULT_TIMEOUT,
});

export const useAuthAPI = () => {
  const { authState } = useOktaAuth();

  function buildAuthOptions(options) {
    const headers = options && options.headers ? options.headers : {};
    if (authState.isAuthenticated) {
      headers.Authorization = `Bearer ${authState.accessToken}`;
    }
    return {
      ...options,
      headers,
    };
  }

  window.api = {
    get: (path, options) => axiosInstance.get(path, buildAuthOptions(options)),
    post: (path, data, options) => axiosInstance.post(path, data, buildAuthOptions(options)),
    delete: (path, options) => axiosInstance.delete(path, buildAuthOptions(options)),
    patch: (path, data, options) => axiosInstance.patch(path, data, buildAuthOptions(options)),
    fetch: (path, options) => {
      const url = `${API_URL}${path}`;
      return window.fetch(url, buildAuthOptions(options));
    },
  };

  return {
    get: (path, options) => axiosInstance.get(path, buildAuthOptions(options)),
    post: (path, data, options) => axiosInstance.post(path, data, buildAuthOptions(options)),
    delete: (path, options) => axiosInstance.delete(path, buildAuthOptions(options)),
    patch: (path, data, options) => axiosInstance.patch(path, data, buildAuthOptions(options)),
    fetch: (path, options) => {
      const url = `${API_URL}${path}`;
      return window.fetch(url, buildAuthOptions(options));
    },
  };
};

export const UserRequired = ({ children }) => {
  const { authState, authService } = useOktaAuth();
  const [user, setUser] = useState(null);
  const authAPI = useAuthAPI();
  useEffect(() => {
    if (user === null && authState.isAuthenticated) {
      authAPI.get('/me', { timeout: 0 }).then(({ data }) => {
        setUser({
          ...data,
          avatar: `https://ui-avatars.com/api/?rounded=true&name=${data.display_name}`,
        });
      });
    }
  }, [authState.isAuthenticated]);

  if (!authState.isPending && !authState.isAuthenticated) {
    authService.login();
  }

  if (authState.isAuthenticated && user !== null) {
    return (
      <User.Provider value={user}>
        {children}
      </User.Provider>
    );
  }
  return <></>;
};

export const useUser = () => useContext(User);

export const usePermission = (featureName) => {
  const user = useUser();

  let hasReadAccess = false;
  if (user.type === 'admin') {
    hasReadAccess = true;
  } else if (user.features[featureName]) {
    hasReadAccess = user.features[featureName].read_access;
  }

  let hasWriteAccess = false;
  if (user.type === 'admin') {
    hasWriteAccess = true;
  } else if (user.features[featureName]) {
    hasWriteAccess = user.features[featureName].write_access;
  }

  return [hasReadAccess, hasWriteAccess];
};

export const useIsAdmin = () => {
  const user = useUser();

  return user.type === 'admin';
};
