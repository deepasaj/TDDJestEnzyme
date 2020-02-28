
/**
 * Convenience method to build the auth header
 */
export function getAuthHeader(token) {
  // return authorization header with jwt token
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}
