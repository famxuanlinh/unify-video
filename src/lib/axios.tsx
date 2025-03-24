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

export const handleRefresh = async () => {
  const token = getCookie(AUTH_TOKEN_KEY);

  if (!token) return null;

  const tokens = JSON.parse(token);

  try {
    const res = await UnifyApi.auth.refreshSession({
      refreshToken: tokens.refresh
    });

    if (res.access) {
      setCookie(AUTH_TOKEN_KEY, JSON.stringify(res));

      return res;
    }
  } catch (error) {
    console.error('Refresh token failed:', error);
    deleteCookie(AUTH_TOKEN_KEY);

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
        if (isRefreshing) {
          return new Promise(resolve => {
            refreshSubscribers.push(token => {
              originalRequest.headers['x-authorization'] = token;
              resolve(apiInstance(originalRequest));
            });
          });
        }
        isRefreshing = true;
        const newToken = await handleRefresh();

        originalRequest.headers['x-authorization'] = newToken;
        isRefreshing = false;
        if (newToken) {
          onRefreshed(newToken.access);
          originalRequest.headers['x-authorization'] = newToken;

          return apiInstance(originalRequest);
        } else {
          return null;
        }
      }

      return Promise.reject(error);
    }
  );
};

setupInterceptors(apiMain);
setupInterceptors(apiAuth);
