'use client';

import { useGetProfile } from '@/hooks/use-get-profile';
import { useSocketStore } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MiniKit } from '@worldcoin/minikit-js';
import React, { useEffect } from 'react';

import { ErudaProvider } from './ErudaProvider';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  const { initSocket } = useSocketStore();
  const { handleGetProfile } = useGetProfile();
  const { data: profile } = useGetProfile();

  useEffect(() => {
    initSocket();
    MiniKit.install();
  }, []);

  useEffect(() => {
    if (!profile) {
      handleGetProfile();
    }
  }, [profile]);

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
