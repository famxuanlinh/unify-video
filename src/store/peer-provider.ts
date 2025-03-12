'use client';

import { create } from 'zustand';

interface PeerState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;

  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
}

const usePeerStore = create<PeerState>(set => ({
  localStream: null,
  remoteStream: null,

  setLocalStream: stream => set({ localStream: stream }),
  setRemoteStream: stream => set({ remoteStream: stream })
}));

export default usePeerStore;
