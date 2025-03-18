'use client';

import { DataConnection, MediaConnection } from 'peerjs';
import { create } from 'zustand';

interface PeerState {
  localStreamRef: MediaStream | null;
  remoteStreamRef: MediaStream | null;
  mediaConnectionRef: MediaConnection | null;
  dataConnectionRef: DataConnection | null;
  peerConnectionRef: DataConnection | null;

  setLocalStreamRef: (stream: MediaStream | null) => void;
  setRemoteStreamRef: (stream: MediaStream | null) => void;
  setMediaConnectionRef: (stream: MediaConnection | null) => void;
  setDataConnectionRef: (stream: DataConnection | null) => void;
  setPeerConnectionRef: (stream: DataConnection | null) => void;
}

export const usePeerStore = create<PeerState>(set => ({
  localStreamRef: null,
  remoteStreamRef: null,
  mediaConnectionRef: null,
  dataConnectionRef: null,
  peerConnectionRef: null,

  setLocalStreamRef: stream => set({ localStreamRef: stream }),
  setRemoteStreamRef: stream => set({ remoteStreamRef: stream }),
  setMediaConnectionRef: stream => set({ mediaConnectionRef: stream }),
  setDataConnectionRef: stream => set({ dataConnectionRef: stream }),
  setPeerConnectionRef: stream => set({ peerConnectionRef: stream })
}));
