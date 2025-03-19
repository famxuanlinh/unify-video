'use client';

import { env } from '@/constants';
import { log } from '@/utils/helpers';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocketIO() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      console.log('Creating new socket instance');
      socketRef.current = io(env.SOCKET_URL, {
        transports: ['websocket']
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
      console.log('Cleanup function called');
    };
  }, []);

  useEffect(() => {
    return () => {
      console.log('Component unmounted, disconnecting');
      socketRef.current?.disconnect();
    };
  }, []);

  return { socket: socketRef.current, isConnected };
}
