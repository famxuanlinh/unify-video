// import { env } from '@/constants';
import Peer from 'peerjs';

export const debugMode =
  process.env.NEXT_PUBLIC_PEER_SECURE === 'true' || false;

export const peer = new Peer({
  host: '0.peerjs.com',
  port: 443,
  path: '/',
  secure: true,
  config: {
    // iceTransportPolicy: 'relay',
    iceServers: [
      {
        urls: 'turn:206.189.151.6:3478',
        username: 'test',
        credential: 'test123'
      },
      {
        urls: ['turn:13.250.13.83:3478?transport=udp'],
        username: 'YzYNCouZM1mhqhmseWk6',
        credential: 'YzYNCouZM1mhqhmseWk6'
      },
      { url: 'stun:stun.l.google.com:19302' },
      { url: 'stun:stun.ekiga.net' },
      { url: 'stun:stun.fwdnet.net' },
      { url: 'stun:stun.ideasip.com' },
      { url: 'stun:stun.iptel.org' },
      { url: 'stun:stun.rixtelecom.se' },
      { url: 'stun:stun.schlund.de' },
      { url: 'stun:stun.l.google.com:19302' },
      { url: 'stun:stun1.l.google.com:19302' },
      { url: 'stun:stun2.l.google.com:19302' },
      { url: 'stun:stun3.l.google.com:19302' },
      { url: 'stun:stun4.l.google.com:19302' },
      { url: 'stun:stunserver.org' },
      { url: 'stun:stun.softjoys.com' },
      { url: 'stun:stun.voiparound.com' },
      { url: 'stun:stun.voipbuster.com' },
      { url: 'stun:stun.voipstunt.com' },
      { url: 'stun:stun.voxgratia.org' },
      { url: 'stun:stun.xten.com' },
      { urls: 'stun:stun.l.google.com:19302' },
      {
        url: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com'
      },
      {
        url: 'turn:192.158.29.39:3478?transport=udp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808'
      },
      {
        url: 'turn:192.158.29.39:3478?transport=tcp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808'
      },
      {
        urls: 'turn:206.189.151.6:3478',
        username: 'test',
        credential: 'test123'
      }
    ]
  }
});

// export const peer = new Peer({
//   host: process.env.NEXT_PUBLIC_PEER_HOST || '0.peerjs.com',
//   port: Number(env.PEER_PORT) || 443,
//   path: env.PEER_PATH || '/',
//   secure: process.env.NEXT_PUBLIC_PEER_SECURE !== 'false',
//   config: {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' },
//       { urls: 'stun:stun1.l.google.com:19302' },
//       { urls: 'stun:stun2.l.google.com:19302' },
//       { urls: 'stun:stun3.l.google.com:19302' },
//       { urls: 'stun:stun4.l.google.com:19302' }
//     ],
//     iceCandidatePoolSize: 10
//   },
//   debug: 0
//   // debug: debugMode ? 3 : 0
// });
