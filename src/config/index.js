/*
 * App configuration
 */

export const NODE_ENV = process.env.NODE_ENV
export const API_URL = process.env.API_URL || 'http://localhost:5000';
export const OKTA_ODIC = {
    issuer: process.env.ODIC_ISSUER || 'https://dev-471294.okta.com/oauth2/default',
    clientId: process.env.ODIC_CLIENT_ID || '0oa304to0bdgwOIIO357',
    redirectUri: process.env.ODIC_REDIRECT_URI || 'http://localhost:3010/auth/callback',
    pkce: true,
    scope: 'openid profile email'
};
// constants
export const VERSION = "0.9.0 Beta"
