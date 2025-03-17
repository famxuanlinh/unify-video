import { AUTH_TOKEN_KEY, env } from '@/constants';
import axios from 'axios';
import { getCookie } from 'cookies-next';

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const baseURL = env.API_BASE_URL,
  isServer = typeof window === 'undefined';

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

export const api = axios.create({
  baseURL
  // withCredentials: true
});

api.interceptors.request.use(
  async config => {
    if (isServer) {
      const { cookies } = await import('next/headers');
      let userRaw = undefined;
      const cookieStore = await cookies();
      userRaw = cookieStore.get(AUTH_TOKEN_KEY)?.value;

      if (userRaw) {
        const { token } = JSON.parse(userRaw);
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } else if (config.headers) {
      const userRaw = JSON.parse((getCookie(AUTH_TOKEN_KEY) as string) || '{}');

      if (userRaw.token) {
        // config.headers['Cookie'] = `Authentication=${userRaw.token}`;
        config.headers['Authorization'] = `Bearer ${userRaw.token}`;
      }

      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  error => {
    Promise.reject(error);
  }
);
