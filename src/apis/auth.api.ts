import { JWT, SigninData } from '@/types';
import { parseToUsername } from '@/utils';
import axios, { AxiosResponse } from 'axios';

import { api } from '@/lib';

export const auth = {
  // async register(payload: { email: string; password: string }): Promise<void> {
  //   return getConnector().backendConnector.post(
  //     '/auth/register',
  //     {
  //       email: payload.email,
  //       password: payload.password
  //     },
  //     process.env.NEXT_PUBLIC_AUTH_BACKEND_URL
  //   );
  // },
  async signup(payload: {
    accountId: string;
    uid: string;

    extraData?: any;
  }): Promise<SigninData> {
    return api
      .post('/auth/sign-up', {
        userId: payload.accountId,
        idToken: payload.uid,
        provider: 'WorldCoinWallet',
        payload: payload.extraData
      })
      .then(res => ({
        ...res.data,
        accountId: parseToUsername(res.data.userId)
      }));
  },
  signin(payload: { uid: string; extraData?: any }): Promise<SigninData> {
    return api
      .post('/auth/sign-in', {
        idToken: payload.uid,
        provider: 'WorldCoinWallet',
        payload: payload.extraData
      })
      .then(res => ({
        ...res.data,
        accountId: parseToUsername(res.data.userId)
      }));
  },
  async refreshSession(payload: { refreshToken: string }): Promise<JWT> {
    return await api
      .post('/auth/refresh-session', {
        refresh: payload.refreshToken
      })
      .then(res => res.data);
  },

  async checkUserExist(
    payload: { userId: string },
    signal: AbortSignal
  ): Promise<AxiosResponse<any, any>> {
    return await axios.get(`/auth/userExisted?userId=${payload.userId}`, {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      signal
    });
  }
};
