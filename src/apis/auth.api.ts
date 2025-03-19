import { env } from '@/constants';
import { JWT, SigninData } from '@/types';
import { parseToUsername } from '@/utils';
import axios, { AxiosResponse } from 'axios';

import { apiAuth } from '@/lib';

export const auth = {
  async signup(payload: {
    accountId: string;
    uid: string;

    extraData?: any;
  }): Promise<SigninData> {
    return apiAuth
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
    return apiAuth
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
    return await apiAuth
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
      baseURL: env.API_AUTH_URL,
      signal
    });
  }
};
