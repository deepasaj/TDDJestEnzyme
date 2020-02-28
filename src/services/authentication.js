import { API_URL } from 'config';

function login(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  };

  return fetch(`${API_URL}/api/auth/login`, requestOptions)
    .then(resp => resp.json())
    .then(data => data);
}

export default {
  login,
};
