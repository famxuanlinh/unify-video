'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import GhostLayout from './ghost-layout';
import { MainLayout } from './main-layout';

interface ProviderProps {
  children: React.ReactNode;
  me?: string;
}

const Provider = ({ children, me }: ProviderProps) => {
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

export default Provider;
