'use client';

import React, { ReactNode, Suspense } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: RootLayoutProps) => {
  return <Suspense>{children}</Suspense>;
};

export default Layout;
