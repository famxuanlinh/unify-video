import { User } from '@/types';
import { create } from 'zustand';

type AuthStore = {
  me: User | null;
  setMe: (data: User | null) => void;
  clearMe: () => void;
};

export const useAuthStore = create<AuthStore>(set => ({
  me: null,

  setMe: (data: User | null) =>
    set(() => ({
      me: data
    })),
  clearMe: () =>
    set(() => ({
      me: null
    }))
}));
