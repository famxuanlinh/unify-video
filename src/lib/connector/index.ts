'use client';

'use client';

import UnifyApi from '@/apis';
import { CHAT_PRIVATE_KEY, StorageKeys } from '@/constants';
import { FluxionConnector } from '@fluxion-labs/web-auth';
import * as Sentry from '@sentry/browser';

// import { BackendProtocalConfig } from '@/configs';

import { BackendResponse, RepConnector } from './type';

export const BackendProtocalConfig = {
  headerKey: 'x-authorization',
  storageKeys: {
    backendJWTAccess: StorageKeys.BACKEND_JWT,
    backendJWTRefresh: StorageKeys.BACKEND_JWT_REFRESH
  }
};

if (!process.env.NEXT_RUNTIME && typeof window !== 'undefined') {
  const fluxionConnector = new FluxionConnector({
    backendConnectorConfig: {
      headerKey: BackendProtocalConfig.headerKey,
      storageKeys: {
        backendJWTAccess: BackendProtocalConfig.storageKeys.backendJWTAccess,
        backendJWTRefresh: BackendProtocalConfig.storageKeys.backendJWTRefresh
      }
    },
    backendConnectorOptions: {
      getRefreshToken: async refreshToken => {
        const res = await UnifyApi.auth.refreshSession({
          refreshToken: refreshToken
        });
        localStorage.setItem('STREAM_TOKEN', res.stream);

        return { accessToken: res.access, refreshToken: res.refresh };
      },
      onError: error => {
        if (
          (error?.status && error?.status >= 404) ||
          error.code === 'ERR_NETWORK'
        ) {
          Sentry.captureException(error);
        }
      },
      onDestroy: () => {
        // sign out gala
        fluxionConnector.galaConnector.signOut();
        localStorage.removeItem(CHAT_PRIVATE_KEY);

        // reset dark mode
        localStorage.setItem('chakra-ui-color-mode', 'dark');

        window.location.href = '/?sync=false';
      }
    },
    galaConnectorConfig: {
      domain: '',
      contractName: '',
      chainCodeName: ''
    },
    galaConnectorOptions: {
      afterCallChangeMethod: () => {}
    }
  });

  setTimeout(() => {
    fluxionConnector.backendConnector.refreshToken();
  }, 1000);

  const repConnector: RepConnector = Object.freeze({
    // bcConnector: Object.assign(fluxionConnector.galaConnector, {
    //   async callEvaluateMethod(endpoint: string, body: object): Promise<any> {
    //     const url = new URL(endpoint, fluxionConnector.galaConnector.baseUrl);
    //     const response: GalaResponse = (
    //       await axios.post(url.toString(), body, {
    //         headers: this.wallet.header()
    //       })
    //     ).data;
    //     console.log(`[GALA] EVALUATE ${endpoint}`);
    //     if (response.Status) {
    //       return response.Data;
    //     } else {
    //       throw response.message;
    //     }
    //   },

    //   async callSubmitMethod<R>(endpoint: string, body: object): Promise<R> {
    //     if (this.wallet.isSignedIn() == undefined)
    //       throw 'Authentication is failed';
    //     const url = new URL(endpoint, fluxionConnector.galaConnector.baseUrl);
    //     const response: GalaResponse = (
    //       await axios.post(url.toString(), this.wallet.sign(body), {
    //         headers: this.wallet.header()
    //       })
    //     ).data;
    //     console.log(`[GALA] SUBMIT ${endpoint}`);
    //     if (response.Status) {
    //       return response.Data as R;
    //     } else {
    //       throw response.message;
    //     }
    //   }
    // }),
    backendConnector: Object.assign(fluxionConnector.backendConnector, {
      async get<R = any>(
        endpoint: string,
        params: { [key: string]: any },
        base?: string
      ): Promise<R> {
        const url = new URL(
          endpoint,
          base ??
            process.env.NEXT_PUBLIC_API_BASE_URL ??
            'http://localhost:3000'
        );
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
        const response: BackendResponse<R> = (
          await fluxionConnector.backendConnector.axios.get(url.toString())
        ).data;
        console.log(`GET ${endpoint}`);
        if (response.success) {
          return response.data;
        } else {
          throw response.message;
        }
      },

      async delete<R = any>(
        endpoint: string,
        params: { [key: string]: any },
        body: any,
        base?: string
      ): Promise<R> {
        const url = new URL(
          endpoint,
          base ??
            process.env.NEXT_PUBLIC_API_BASE_URL ??
            'http://localhost:3000'
        );
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
        const response: BackendResponse<R> = (
          await fluxionConnector.backendConnector.axios.delete(url.toString(), {
            data: body
          })
        ).data;
        console.log(`DELETE ${endpoint}`);
        if (response.success) {
          return response.data;
        } else {
          throw response.message;
        }
      },

      async post<R = any>(
        endpoint: string,
        body: any,
        base?: string
      ): Promise<R> {
        const url = new URL(
          endpoint,
          base ??
            process.env.NEXT_PUBLIC_API_BASE_URL ??
            'http://localhost:3000'
        );
        const response: BackendResponse<R> = (
          await fluxionConnector.backendConnector.axios.post(
            url.toString(),
            body
          )
        ).data;
        console.log(`POST ${endpoint}`);
        if (response.success) {
          return response.data;
        } else {
          throw response.message;
        }
      }
    })
  });

  (window as any).connector = repConnector;
}

export function getConnector(): RepConnector {
  return !process.env.NEXT_RUNTIME && (window as any).connector
    ? (window as any).connector
    : ({} as RepConnector);
}
