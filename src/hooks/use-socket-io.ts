import { log } from '@/utils/helpers';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocketIO() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      console.log('useSocketIO: Creating new socket instance');
      socketRef.current = io('http://localhost:3001', {
        transports: ['websocket']
      });

      socketRef.current.on('connect', () => {
        console.log('useSocketIO: Socket connected');
        setIsConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        log('useSocketIO: Socket disconnected');
        setIsConnected(false);
      });
    } else {
      console.log('useSocketIO: Socket instance already exists');
    }

    return () => {
      console.log('useSocketIO: Cleanup function called');
    };
  }, []);

  useEffect(() => {
    return () => {
      console.log('useSocketIO: component unmounted, disconnecting');
      socketRef.current?.disconnect();
    };
  }, []);

  return { socket: socketRef.current, isConnected };
}
