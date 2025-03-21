import { User } from '@/types';
import React from 'react';

import { AuthProvider } from './auth-provider';
import Header from './header';

interface MainLayoutProps {
  children: React.ReactNode;
  me: User | null;
}

export const MainLayout = async ({ children, me }: MainLayoutProps) => {
  return (
    <div className="relative">
      <Header />
      <AuthProvider me={me}>{children}</AuthProvider>
    </div>
  );
};
