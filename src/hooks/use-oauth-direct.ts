import * as Sentry from '@sentry/browser';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import UnifyApi from '@/apis';
import { getConnector } from '@/lib';
import { Base64, Embedded, ModalUtils } from '@/utils';

import { MiniKit } from '@worldcoin/minikit-js';
import { toast } from './use-toast';
import { AuthData } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';

export type SignInMethod =
  | 'google'
  | 'apple'
  | 'x'
  | 'usernamePassword'
  | 'linkedIn'
  | 'worldID'
  | 'worldWalletAuth';

export function uint8ArrayToHexString(uint8Array: Uint8Array): string {
  return Buffer.from(uint8Array).toString(`hex`);
}

const loginAndRedirect = async (auth: AuthData) => {
  const isEmbedded = Embedded.isEmbeddedInIframe();
  getConnector().backendConnector.init(auth.access, auth.refresh);

  window.localStorage.setItem('STREAM_TOKEN', auth.stream);

  if (!isEmbedded && !MiniKit.isInstalled()) {
    ModalUtils.kycWelcome.onOpen({
      onClose: () => {
        window.location.replace(`${window.location.origin}`);
      }
    });
  } else {
    window.location.replace(`${window.location.origin}`);
  }
};

export const useOAuthDirect = () => {
  const [torusLoading, setTorusLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState<boolean>();
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const idToken = searchParams.get('token');
  const providerId = searchParams.get('providerId')?.toString() as
    | SignInMethod
    | undefined;

  const registerForm = useForm<{
    accountId: string;
    uid: string;
    publicKey: string;
  }>({
    mode: 'onChange'
  });

  const signUp = async (accountId: string, token: string) => {
    try {
      setIsRegisterLoading(true);

      let payload: Parameters<typeof UnifyApi.auth.signup>[0] = {
        accountId,
        uid: token
      };

      if (providerId === 'worldWalletAuth') {
        const extraData = await Base64.decode(token);
        payload = { uid: '', accountId, extraData };
      }

      if (!!token && !!accountId) {
        const res = await UnifyApi.auth.signup(payload);
        await loginAndRedirect(res);
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const handleRegisterFormSubmit = registerForm.handleSubmit(async data => {
    try {
      await signUp(data.accountId, data.uid);
    } catch (e) {
      toast({
        description: 'Register failed!'
      });
    }
  });

  useEffect(() => {
    (async () => {
      // if (!router.isReady) return;

      if (!idToken || typeof idToken !== 'string') {
        toast({
          description: 'An error occurred. Please try again!'
        });
        router.push('/');
        return;
      }

      // Handle small auth window redirection in Repsocial embeded
      try {
        const { opener } = window;
        if (opener?.authWindow) {
          opener.authWindow.close();
          opener.location.href = window.location.href;
          delete opener.authWindow;
          return;
        }
      } catch (error) {
        console.error('Error handling auth window:', error);
        Sentry.captureException(error);
      }

      setTorusLoading(true);

      try {
        const extraData = await Base64.decode(idToken);
        const payload = { uid: 'aaa', extraData };

        const response = await UnifyApi.auth.signin(payload);

        if (response?.privateKey) {
          setIsNewUser(false);
          loginAndRedirect(response);
          return;
        }

        // If response is null or missing privateKey, treat as account does not exist
        console.log('The account does not exist', idToken);
        toast({
          description: 'The account does not exist. Please try again!'
        });
        router.push('/');
        Sentry.captureException(new Error('The account does not exist'));
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
            console.log(
              extraData,
              userAddress,
              worldIdUser,
              walletUsername,
              idToken
            );
            registerForm.setValue('accountId', walletUsername);
            try {
              await signUp(walletUsername, idToken);
            } catch (e) {
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

  return {
    oauthDirectState: {
      torusLoading,
      registerForm,
      isNewUser,
      isRegisterLoading
    },
    oauthDirectMethods: {
      // triggerLogin,
      signUp,
      handleRegisterFormSubmit
    }
  };
};
