import { ReactNode } from 'react';

import { MainLayout } from '@/components';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  return <MainLayout>{children}</MainLayout>;
};

export default RootLayout;
