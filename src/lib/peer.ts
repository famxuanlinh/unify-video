import { env } from '@/constants';
import Peer from 'peerjs';

export const debugMode =
  process.env.NEXT_PUBLIC_PEER_SECURE === 'true' || false;

// export const peer = new Peer({
//   host: '146.190.192.108',
//   port: 9000,
//   path: '/',
//   secure: false, // Nếu server chạy HTTP, giữ `false`
//   debug: 3, // Log chi tiết
//   config: {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' },
//       {
//         urls: 'turn:206.189.151.6:3478',
//         username: 'test',
//         credential: 'test123'
//       }
//     ]
//   }
// });

// peer.on('open', id => console.log('Peer Open:', id));
// peer.on('error', err => console.error('PeerJS Error:', err));

export const peerConfig = new Peer({
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
      { urls: 'stun:stun4.l.google.com:19302' },
      { urls: 'stun:stun.relay.metered.ca:80' },
      {
        urls: 'turn:global.relay.metered.ca:80',
        username: '49763634d32cb15840386edc',
        credential: 'G0Jf2GvnWd4IOGj6'
      },
      {
        urls: 'turn:global.relay.metered.ca:80?transport=tcp',
        username: '49763634d32cb15840386edc',
        credential: 'G0Jf2GvnWd4IOGj6'
      },
      {
        urls: 'turn:global.relay.metered.ca:443',
        username: '49763634d32cb15840386edc',
        credential: 'G0Jf2GvnWd4IOGj6'
      },
      {
        urls: 'turns:global.relay.metered.ca:443?transport=tcp',
        username: '49763634d32cb15840386edc',
        credential: 'G0Jf2GvnWd4IOGj6'
      },
      {
        urls: 'turn:206.189.151.6:3478?transport=udp',
        username: 'test',
        credential: 'test123'
      }
    ],
    iceCandidatePoolSize: 10
  },
  debug: 0
  // debug: debugMode ? 3 : 0
});
