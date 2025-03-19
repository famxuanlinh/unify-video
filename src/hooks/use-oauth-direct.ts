'use client';

import UnifyApi from '@/apis';
import { AUTH_TOKEN_KEY } from '@/constants';
import { useAuthStore } from '@/store';
import { Base64 } from '@/utils';
import * as Sentry from '@sentry/browser';
import { MiniKit } from '@worldcoin/minikit-js';
import { AxiosError } from 'axios';
import { deleteCookie, setCookie } from 'cookies-next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { toast } from './use-toast';

export type SignInMethod = 'worldID' | 'worldWalletAuth';

export const useOAuthDirect = () => {
  const [torusLoading, setTorusLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState<boolean>();
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>();

  const { setMe } = useAuthStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const idToken = searchParams.get('token');
  const providerId = searchParams.get('providerId')?.toString() as
    | SignInMethod
    | undefined;

  const registerForm = useForm<{
    accountId: string;
    uid: string;
  }>({
    mode: 'onChange'
  });

  const signUp = async (accountId: string, token: string) => {
    try {
      setIsRegisterLoading(true);

      const extraData = await Base64.decode(token);
      const payload = { uid: '', accountId, extraData };

      const res = await UnifyApi.auth.signup(payload);
      setCookie(AUTH_TOKEN_KEY, `${JSON.stringify(res)}`);
      toast({
        description: 'Register successful!'
      });
      window.location.href = '/';
    } catch (error) {
      console.log('Error register: ', error);
      throw error;
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const handleRegisterFormSubmit = registerForm.handleSubmit(async data => {
    try {
      await signUp(data.accountId, data.uid);
    } catch (e) {
      console.log(e);
      toast({
        description: 'Register failed!'
      });
    }
  });

  useEffect(() => {
    (async () => {
      if (!idToken || typeof idToken !== 'string') {
        toast({
          description: 'An error occurred. Please try again!'
        });
        router.push('/');

        return;
      }

      setTorusLoading(true);

      try {
        const extraData = await Base64.decode(idToken);
        const payload = { uid: '', extraData };

        const res = await UnifyApi.auth.signin(payload);
        setCookie(AUTH_TOKEN_KEY, `${JSON.stringify(res)}`);
        toast({
          description: 'Signin successful!'
        });

        setIsNewUser(false);

        window.location.href = '/';
      } catch (error) {
        const axiosError = error as AxiosError<{
          message: string;
          success: boolean;
        }>;
        const errorMessage = axiosError.response?.data.message;

        if (
          axiosError.response?.status === 404 &&
          errorMessage === 'Account does not exist'
        ) {
          registerForm.setValue('uid', idToken);

          // strip all dots
          if (providerId === 'worldWalletAuth') {
            const extraData = await Base64.decode(idToken);
            const userAddress = extraData.payload.address;
            const worldIdUser = await MiniKit.getUserByAddress(userAddress);
            const walletUsername = (worldIdUser?.username ?? '').replaceAll(
              '.',
              ''
            );
            registerForm.setValue('accountId', walletUsername);
            try {
              await signUp(walletUsername, idToken);
            } catch (e) {
              console.log(e);

              toast({
                description: 'Username already exists.'
              });
            }
          }

          setIsNewUser(true);

          return;
        }

        console.log('Failed to sign in', error);
        toast({
          description: 'An error occurred. Please try again!'
        });
        router.push('/');
        Sentry.captureException(error);
      } finally {
        setTorusLoading(false);
      }
    })();
  }, [idToken, providerId]);

  const handleLogOut = () => {
    deleteCookie(AUTH_TOKEN_KEY);
    setMe(null);
    window.location.href = '/';
  };

  return {
    oauthDirectState: {
      torusLoading,
      registerForm,
      isNewUser,
      isRegisterLoading
    },
    oauthDirectMethods: {
      signUp,
      handleRegisterFormSubmit,
      handleLogOut
    }
  };
};
