'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { MainLayout, GhostLayout } from '@/components';

interface ProviderProps {
  children: React.ReactNode;
  me?: string;
}

export const Provider = ({ children, me }: ProviderProps) => {
  const queryClient = new QueryClient();

  return (
    <MainLayout>
      <QueryClientProvider client={queryClient}>
        <GhostLayout me={me} />
        {children}
      </QueryClientProvider>
    </MainLayout>
  );
};
