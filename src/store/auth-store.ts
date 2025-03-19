import { SigninData } from '@/types';
import { create } from 'zustand';

type AuthStore = {
  signinData?: SigninData | null;
  setSigninData: (data: SigninData) => void;
  clearSigninData: () => void;
};

export const useAuthStore = create<AuthStore>(set => ({
  setSigninData: (data: SigninData) =>
    set(() => ({
      signinData: data
    })),
  clearSigninData: () =>
    set(() => ({
      signinData: null
    }))
}));
