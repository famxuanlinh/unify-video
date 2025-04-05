'use client';

import { MapConfig } from '@/configs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { APIProvider } from '@vis.gl/react-google-maps';
import { MiniKit } from '@worldcoin/minikit-js';
import React, { useEffect } from 'react';

import { ErudaProvider } from './eruda-provider';

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  useEffect(() => {
    MiniKit.install();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <APIProvider apiKey={MapConfig.GOOGLE_MAP_API_KEY} version={'beta'}>
        <ErudaProvider>{children}</ErudaProvider>
      </APIProvider>
    </QueryClientProvider>
  );
};
