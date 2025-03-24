import { AUTH_TOKEN_KEY, env } from '@/constants';
import { MESSAGE_EVENTS } from '@/types';
import { deleteCookie, getCookie } from 'cookies-next';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

import { handleRefresh } from '@/lib';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  initSocket: () => void;
  disconnectSocket: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  initSocket: () => {
    if (get().socket) {
      console.log('Socket already exists');

      return;
    }

    const tokensRaw = JSON.parse((getCookie(AUTH_TOKEN_KEY) as string) || '{}');
    if (!tokensRaw?.access) {
      console.warn('No access token found, cannot initialize socket');

      return;
    }

    console.log('Creating new socket instance');
    let socketInstance = io(env.SOCKET_URL, {
      extraHeaders: { 'x-authorization': tokensRaw.access }
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      set({ isConnected: true });
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      set({ isConnected: false });
    });

    socketInstance.on(
      MESSAGE_EVENTS.AUTH_ERROR,
      async ({ message }: { message: string }) => {
        const newTokens = await handleRefresh();

        if (newTokens) {
          console.log(message);
          socketInstance.disconnect();

          socketInstance = io(env.SOCKET_URL, {
            extraHeaders: { 'x-authorization': newTokens.access }
          });

          set({ socket: socketInstance });
        } else {
          console.log('Failed to refresh token, logging out');
          deleteCookie(AUTH_TOKEN_KEY);
          socketInstance.disconnect();
        }
      }
    );

    set({ socket: socketInstance });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      console.log('Disconnecting socket');
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  }
}));
