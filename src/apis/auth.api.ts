import axios, { AxiosResponse } from 'axios';

import { getConnector } from '@/lib';
import { parseToUsername } from '@/utils';

export type AuthData = {
  accountId: string;
  encryptionKey: string;
  privateKey: string;
} & JWT;

export type JWT = {
  access: string;
  refresh: string;
  stream: string;
};

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
  // async signup(payload: {
  //   accountId: string;
  //   uid: string;

  //   extraData?: any;
  // }): Promise<BackendResponse<AuthData>> {
  //   return api
  //     .post('/auth/sign-up', {
  //       userId: payload.accountId,
  //       idToken: payload.uid,
  //       provider: 'WorldId',
  //       payload: payload.extraData
  //     })
  //     .then(res => ({
  //       ...res.data,
  //       accountId: parseToUsername(res.data.userId)
  //     }));
  // },
  // signin(payload: {
  //   uid: string;
  //   extraData?: any;
  // }): Promise<BackendResponse<AuthData>> {
  //   return api
  //     .post('/auth/sign-in', {
  //       idToken: payload.uid,
  //       provider: 'WorldId',
  //       payload: payload.extraData
  //     })
  //     .then(res => ({
  //       ...res.data,
  //       accountId: parseToUsername(res.data.userId)
  //     }));
  // },
  async signup(payload: {
    accountId: string;
    uid: string;
    providerId?: string;
    extraData?: any;
  }): Promise<AuthData> {
    const res = await getConnector().backendConnector.post(
      '/auth/sign-up',
      {
        userId: payload.accountId,
        idToken: payload.uid,
        provider: 'WorldCoinWallet',
        payload: payload.extraData
      },
      process.env.NEXT_PUBLIC_API_BASE_URL
    );
    return { ...res, accountId: parseToUsername(res.userId) };
  },
  async signin(payload: {
    uid: string;
    providerId?: string;
    extraData?: any;
  }): Promise<AuthData> {
    const res = await getConnector().backendConnector.post(
      '/auth/sign-in',
      {
        idToken: payload.uid,
        provider: 'WorldCoinWallet',
        payload: payload.extraData
      },
      process.env.NEXT_PUBLIC_API_BASE_URL
    );
    return { ...res, accountId: parseToUsername(res.userId) };
  },
  async refreshSession(payload: { refreshToken: string }): Promise<JWT> {
    const res = await getConnector().backendConnector.post(
      '/auth/refresh-session',
      {
        refresh: payload.refreshToken
      },
      process.env.NEXT_PUBLIC_API_BASE_URL
    );
    return res;
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

  // async canKYC(): Promise<boolean> {
  //   return getConnector()
  //     .backendConnector.get(
  //       '/auth/can-kyc',
  //       {},
  //       process.env.NEXT_PUBLIC_AUTH_BACKEND_URL
  //     )
  //     .then(() => true)
  //     .catch(() => false);
  // }
};
