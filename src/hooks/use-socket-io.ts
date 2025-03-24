'use client';

import { AUTH_TOKEN_KEY, env } from '@/constants';
import { log } from '@/utils/helpers';
import { getCookie } from 'cookies-next';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocketIO() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const tokensRaw = JSON.parse((getCookie(AUTH_TOKEN_KEY) as string) || '{}');

  useEffect(() => {
    if (!tokensRaw?.access) {
      return;
    }

    if (!socketRef.current) {
      console.log('Creating new socket instance');

      socketRef.current = io(env.SOCKET_URL, {
        extraHeaders: {
          'x-authorization': tokensRaw?.access
        }
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        log('Socket disconnected');
        setIsConnected(false);
      });
    } else {
      console.log('Socket instance already exists');
    }

    return () => {
      console.log('Cleanup function called, disconnecting socket');
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return { socket: socketRef.current, isConnected };
}
