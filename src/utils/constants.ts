'use client';

import env from '@/constants/env';
import Peer from 'peerjs';

export const debugMode =
  process.env.NEXT_PUBLIC_PEER_SECURE === 'true' || false;

const isClient = typeof window !== 'undefined';

export const peer = new Peer({
  host: process.env.NEXT_PUBLIC_PEER_HOST || '0.peerjs.com',
  port: Number(env.PEER_PORT) || 443,
  path: env.PEER_PATH || '/',
  secure: process.env.NEXT_PUBLIC_PEER_SECURE !== 'false',
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ],
    iceCandidatePoolSize: 10
  },
  debug: debugMode ? 3 : 0
});

const SERVER_PORT = env.PEER_PORT || 5000;
const CLIENT_PORT = 3000;

// Đảm bảo WebSocket URL được thiết lập đúng cho môi trường production
export const WS_URL = isClient
  ? window.location.href
      .replace('http', 'ws')
      .replace(CLIENT_PORT.toString(), SERVER_PORT.toString())
  : env.API_BASE_URL || '';

console.log('WebSocket URL:', WS_URL);
console.log('Debug Mode:', debugMode);

export const HEARTBEAT = {
  message: 'ping',
  interval: 58000,
  timeout: 120000,
  returnMessage: 'pong'
};

export const MESSAGE_EVENTS = {
  MATCH: 'match',
  WAITING: 'waiting',
  JOIN: 'join',
  SKIP: 'skip'
};
