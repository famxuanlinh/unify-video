import { User } from '@/types';
import { create } from 'zustand';

interface MainState {
  started: boolean;
  loading: boolean;
  waitingForMatch: boolean;
  error: string | null;
  ready: boolean;
  onlineUsersCount: number;
  incomingUserInfo: User | null;
  isCameraOn: boolean;
  isMicOn: boolean;
  isIncomingCameraOn: boolean;
  isIncomingMicOn: boolean;
  timeStreaming: number;
  callId: string;
  isEndCall: boolean;

  setStarted: (started: boolean) => void;
  setLoading: (loading: boolean) => void;
  setWaitingForMatch: (waitingForMatch: boolean) => void;
  setReady: (ready: boolean) => void;
  setError: (error: string | null) => void;
  setIncomingUserInfo: (incomingUserInfo: User | null) => void;
  setOnlineUsersCount: (onlineUsersCount: number) => void;
  setIsCameraOn: (value: boolean) => void;
  setIsMicOn: (value: boolean) => void;
  setIsIncomingCameraOn: (value: boolean) => void;
  setIsIncomingMicOn: (value: boolean) => void;
  setTimeStreaming: (timeStreaming: number) => void;
  setCallId: (callId: string) => void;
  setIsEndCall: (isEndCall: boolean) => void;
}

export const useMainStore = create<MainState>(set => ({
  started: false,
  loading: false,
  waitingForMatch: false,
  error: null,
  ready: false,
  onlineUsersCount: 1,
  incomingUserInfo: null,
  isCameraOn: true,
  isMicOn: true,
  isIncomingCameraOn: true,
  isIncomingMicOn: true,
  timeStreaming: 0,
  callId: '',
  isEndCall: false,

  setStarted: started => set({ started }),
  setLoading: loading => set({ loading }),
  setWaitingForMatch: waitingForMatch => set({ waitingForMatch }),
  setReady: ready => set({ ready }),
  setError: error => set({ error }),
  setOnlineUsersCount: onlineUsersCount => set({ onlineUsersCount }),
  setIncomingUserInfo: incomingUserInfo => set({ incomingUserInfo }),

  setIsCameraOn: value => set(() => ({ isCameraOn: value })),
  setIsMicOn: value => set(() => ({ isMicOn: value })),
  setIsIncomingCameraOn: value => set(() => ({ isIncomingCameraOn: value })),
  setIsIncomingMicOn: value => set(() => ({ isIncomingMicOn: value })),
  setTimeStreaming: value => set(() => ({ timeStreaming: value })),
  setCallId: callId => set({ callId }),
  setIsEndCall: isEndCall => set(() => ({ isEndCall }))
}));
