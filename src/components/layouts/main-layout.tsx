import React from 'react';

import { AuthLayout } from './auth-layout';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = async ({ children }: MainLayoutProps) => {
  return (
    <div className="relative">
      {/* <Header /> */}
      <AuthLayout>{children}</AuthLayout>
    </div>
  );
};
