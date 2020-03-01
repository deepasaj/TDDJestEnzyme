import axios from "axios";

import { API_URL } from 'config';

export async function get(auth, url, options) {
    console.log('before use auth');
    console.log(auth);
    const accessToken = await auth.getAccessToken();
    console.log(accessToken);
    console.log('kk finish here');

    const headers = {...options.headers};
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }
    return axios.get(url, {
        ...options,
        headers
    });
}
export default {
    get
}