import UnifyApi from '@/apis';
import { AUTH_TOKEN_KEY, env } from '@/constants';
import axios, { AxiosInstance } from 'axios';
import { getCookie, deleteCookie, setCookie } from 'cookies-next/client';

const isServer = typeof window === 'undefined';

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

const API_BASE_URLS = {
  main: env.API_BASE_URL,
  auth: env.API_AUTH_URL,
  current: env.API_CURRENT_URL
};

// Create multiple axios instances
export const apiMain = axios.create({ baseURL: API_BASE_URLS.main });
export const apiAuth = axios.create({ baseURL: API_BASE_URLS.auth });
export const apiCurrent = axios.create({ baseURL: API_BASE_URLS.current });

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

export const refreshToken = async () => {
  if (isRefreshing) {
    return new Promise<string>(resolve => {
      refreshSubscribers.push(resolve);
    });
  }

  isRefreshing = true;

  const tokenData = getCookie(AUTH_TOKEN_KEY);
  if (!tokenData) {
    console.log('No refresh token available');
    isRefreshing = false;

    return null;
  }

  try {
    const tokens = JSON.parse(tokenData);
    const res = await UnifyApi.auth.refreshSession({
      refreshToken: tokens.refresh
    });

    if (res.access) {
      setCookie(AUTH_TOKEN_KEY, JSON.stringify(res));
      isRefreshing = false;
      onRefreshed(res.access);

      return res.access;
    }
  } catch (error) {
    console.log('Refresh token failed:', error);
    deleteCookie(AUTH_TOKEN_KEY);
    isRefreshing = false;

    return null;
  }
};

const setupInterceptors = (apiInstance: AxiosInstance) => {
  apiInstance.interceptors.request.use(
    async config => {
      if (isServer) {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const tokensRaw = cookieStore.get(AUTH_TOKEN_KEY)?.value;

        if (tokensRaw) {
          const { access } = JSON.parse(tokensRaw);
          config.headers['x-authorization'] = access;
        }
      } else if (config.headers) {
        const tokensRaw = JSON.parse(
          (getCookie(AUTH_TOKEN_KEY) as string) || '{}'
        );

        if (tokensRaw.access) {
          config.headers['x-authorization'] = tokensRaw.access;
        }

        config.headers['Content-Type'] = 'application/json';
      }

      return config;
    },
    error => Promise.reject(error)
  );

  apiInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const newToken = await refreshToken();
        if (newToken) {
          originalRequest.headers['x-authorization'] = newToken;

          return apiInstance(originalRequest);
        }
      }

      return Promise.reject(error);
    }
  );
};

setupInterceptors(apiMain);
setupInterceptors(apiAuth);
