import UnifyApi from '@/apis';
import { AUTH_TOKEN_KEY, env } from '@/constants';
import axios from 'axios';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const isServer = typeof window === 'undefined';

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

const API_BASE_URLS = {
  main: env.API_BASE_URL,
  auth: env.API_AUTH_URL
};

// Create multiple axios instances
export const apiMain = axios.create({ baseURL: API_BASE_URLS.main });
export const apiAuth = axios.create({ baseURL: API_BASE_URLS.auth });

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

const handleRefresh = async () => {
  const userRaw = JSON.parse((getCookie(AUTH_TOKEN_KEY) as string) || '{}');
  if (!userRaw.refresh) return null;

  try {
    const res = await UnifyApi.auth.refreshSession({
      refreshToken: userRaw.refresh
    });

    if (res.access) {
      setCookie(AUTH_TOKEN_KEY, `${JSON.stringify(res)}`);
      onRefreshed(res.access);

      return res.access;
    }
  } catch (error) {
    console.error('Refresh token failed:', error);
    deleteCookie(AUTH_TOKEN_KEY);

    return null;
  }
};

apiMain.interceptors.request.use(
  async config => {
    if (isServer) {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const userRaw = cookieStore.get(AUTH_TOKEN_KEY)?.value;

      if (userRaw) {
        const { access } = JSON.parse(userRaw);
        config.headers['x-authorization'] = access;
      }
    } else if (config.headers) {
      const userRaw = JSON.parse((getCookie(AUTH_TOKEN_KEY) as string) || '{}');

      if (userRaw.access) {
        config.headers['x-authorization'] = userRaw.access;
      }

      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  error => Promise.reject(error)
);

apiMain.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(resolve => {
          refreshSubscribers.push(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(apiMain(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const newToken = await handleRefresh();
      isRefreshing = false;

      if (newToken) {
        onRefreshed(newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        return apiMain(originalRequest);
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
