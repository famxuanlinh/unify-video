// use-socket-io.ts
import { AUTH_TOKEN_KEY, env } from '@/constants';
import { MESSAGE_EVENTS } from '@/types';
import { getCookie } from 'cookies-next';
import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

import { refreshToken } from '@/lib';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const tokensRaw = JSON.parse((getCookie(AUTH_TOKEN_KEY) as string) || '{}');

    if (tokensRaw?.access && !socketRef.current) {
      console.log('🔌 Creating new socket instance');

      socketRef.current = io(env.SOCKET_URL, {
        extraHeaders: {
          'x-authorization': tokensRaw.access
        }
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Socket connected');
        setIsConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        setIsConnected(false);
      });

      socketRef.current.on(MESSAGE_EVENTS.AUTH_ERROR, async error => {
        console.error('⚠️ Socket connection error:', error);

        if (error?.message === 'Unauthorized') {
          console.log('🔄 Token expired, refreshing...');
          const newAccessToken = await refreshToken(); // Refresh token

          if (newAccessToken) {
            console.log('🔄 Reconnecting socket with new token...');
            if (socketRef.current) {
              socketRef.current.io.opts.extraHeaders = {
                ...socketRef.current.io.opts.extraHeaders,
                'x-authorization': newAccessToken
              };
              socketRef.current.connect();
            }
          }
        }
      });
    }

    if (socketRef.current && !isConnected) {
      socketRef.current.connect();
    }

    return () => {
      if (socketRef.current) {
        console.log('🚪 Cleanup: disconnecting socket');
        socketRef.current.disconnect();
      }
    };
  }, []);

  return { socket: socketRef.current, isConnected };
};
