import { env } from '@/constants';
import Peer from 'peerjs';

export const debugMode =
  process.env.NEXT_PUBLIC_PEER_SECURE === 'true' || false;

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
  debug: 0
  // debug: debugMode ? 3 : 0
});
