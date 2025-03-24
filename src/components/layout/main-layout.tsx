import React from 'react';

import { AuthProvider } from './auth-provider';
import Header from './header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = async ({ children }: MainLayoutProps) => {
  return (
    <div className="relative">
      <Header />
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
};
