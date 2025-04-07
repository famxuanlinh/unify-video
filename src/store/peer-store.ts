'use client';

import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { create } from 'zustand';

interface PeerState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  mediaConnection: MediaConnection | null;
  dataConnection: DataConnection | null;
  peerConnection: DataConnection | null;
  peer: Peer | null;
  myPeerId: string;

  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  setMediaConnection: (stream: MediaConnection | null) => void;
  setDataConnection: (stream: DataConnection | null) => void;
  setPeerConnection: (stream: DataConnection | null) => void;
  setMyPeerId: (value: string) => void;
  setPeer: (peer: Peer) => void;
  clearPeer: () => void;
}

export const usePeerStore = create<PeerState>(set => ({
  localStream: null,
  remoteStream: null,
  mediaConnection: null,
  dataConnection: null,
  peerConnection: null,
  myPeerId: '',

  peer: null as Peer | null,

  setLocalStream: stream => set({ localStream: stream }),
  setRemoteStream: stream => set({ remoteStream: stream }),
  setMediaConnection: stream => set({ mediaConnection: stream }),
  setDataConnection: stream => set({ dataConnection: stream }),
  setPeerConnection: stream => set({ peerConnection: stream }),
  setMyPeerId: value => set({ myPeerId: value }),

  setPeer: (peer: Peer) => set({ peer }),
  clearPeer: () => set({ peer: null })
}));
