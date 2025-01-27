/* eslint-disable prefer-destructuring */
/*
 * App configuration
 */

export const NODE_ENV = process.env.NODE_ENV;
export const API_URL = process.env.API_URL || 'http://ec2-54-226-199-120.compute-1.amazonaws.com:5000';
export const OKTA_OIDC = {
  issuer: process.env.ODIC_ISSUER || 'https://dev-471294.okta.com/oauth2/default',
  clientId: process.env.ODIC_CLIENT_ID || '0oa304to0bdgwOIIO357',
  redirectUri: process.env.ODIC_REDIRECT_URI || 'http://localhost:3010/auth/callback',
  pkce: false,
  scope: 'openid profile email',
  cookies: {
    secure: false,
  },
};
// constants
export const VERSION = '0.9.0 Beta';
export const API_DEFAULT_TIMEOUT = 7000;
export const FEATURES = [
  {
    value: 'inventory',
    label: 'Inventory',
  },
  {
    value: 'dashboard',
    label: 'Dashboard',
  },
  {
    value: 'workflow',
    label: 'Workflow',
  },
];
