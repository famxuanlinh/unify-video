'use client';

import { useAuthStore } from '@/store';
import { User } from '@/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MiniKit } from '@worldcoin/minikit-js';
import React, { useEffect } from 'react';

import { ErudaProvider } from './ErudaProvider';

export const AuthProvider = ({
  children,
  me
}: {
  children: React.ReactNode;
  me: User | null;
}) => {
  const queryClient = new QueryClient();
  const setMe = useAuthStore(store => store.setMe);

  useEffect(() => {
    MiniKit.install();
  }, []);

  useEffect(() => {
    if (me) {
      setMe(me);
    }
  }, []);

  return (
    <>
      <ErudaProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ErudaProvider>
    </>
  );
};
