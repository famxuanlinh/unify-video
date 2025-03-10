'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import GhostLayout from './GhostLayout';

interface ProviderProps {
  children: React.ReactNode;
  me?: string;
}

const Provider = ({ children, me }: ProviderProps) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <GhostLayout me={me} />
      {children}
    </QueryClientProvider>
  );
};

export default Provider;
