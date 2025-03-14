import { BackendConnector, GalaConnector } from '@fluxion-labs/web-auth';

export type RepConnector = {
  bcConnector?: GalaConnector & {
    callEvaluateMethod(endpoint: string, body: object): Promise<any>;
    callSubmitMethod<R>(endpoint: string, body: object): Promise<R>;
  };
  backendConnector: BackendConnector & {
    get<R = any>(
      endpoint: string,
      params: { [key: string]: any },
      base?: string
    ): Promise<R>;
    delete<R = any>(
      endpoint: string,
      params: { [key: string]: any },
      body: any,
      base?: string
    ): Promise<R>;
    post<R = any>(endpoint: string, body: any, base?: string): Promise<R>;
  };
};

export type BackendResponse<T = object | undefined> = {
  success: boolean;
  message: string;
  data: T;
};
