import { create } from 'zustand';

interface MainState {
  started: boolean;
  loading: boolean;
  waitingForMatch: boolean;
  error: string | null;
  ready: boolean;
  onlineUsersCount: number;

  setStarted: (started: boolean) => void;
  setLoading: (loading: boolean) => void;
  setWaitingForMatch: (waitingForMatch: boolean) => void;
  setReady: (ready: boolean) => void;
  setError: (error: string | null) => void;
  setOnlineUsersCount: (onlineUsersCount: number) => void;
}

const useMainStore = create<MainState>(set => ({
  started: false,
  loading: false,
  waitingForMatch: false,
  error: null,
  ready: false,
  onlineUsersCount: 1,

  setStarted: started => set({ started }),
  setLoading: loading => set({ loading }),
  setWaitingForMatch: waitingForMatch => set({ waitingForMatch }),
  setReady: ready => set({ ready }),
  setError: error => set({ error }),
  setOnlineUsersCount: onlineUsersCount => set({ onlineUsersCount })
}));

export default useMainStore;
