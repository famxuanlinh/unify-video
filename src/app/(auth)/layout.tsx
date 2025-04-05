import { ReactNode } from 'react';

import { AuthLayout } from '@/components';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default RootLayout;
