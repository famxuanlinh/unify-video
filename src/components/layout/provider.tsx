'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { MainLayout, ErudaProvider } from '@/components';

import { AuthProvider } from './auth-provider';

interface ProviderProps {
  children: React.ReactNode;
  me?: string;
}

export const Provider = ({ children }: ProviderProps) => {
  const queryClient = new QueryClient();

  return (
    <MainLayout>
      <AuthProvider>
        <ErudaProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ErudaProvider>
      </AuthProvider>
    </MainLayout>
  );
};
