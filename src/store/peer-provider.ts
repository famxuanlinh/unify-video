'use client';

import { create } from 'zustand';

interface PeerState {
  localStreamRef: MediaStream | null;
  remoteStreamRef: MediaStream | null;

  setLocalStreamRef: (stream: MediaStream | null) => void;
  setRemoteStreamRef: (stream: MediaStream | null) => void;
}

export const usePeerStore = create<PeerState>(set => ({
  localStreamRef: null,
  remoteStreamRef: null,

  setLocalStreamRef: stream => set({ localStreamRef: stream }),
  setRemoteStreamRef: stream => set({ remoteStreamRef: stream })
}));
