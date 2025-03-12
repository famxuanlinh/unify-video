import '@/styles/globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

import { Toaster } from '@/components/core/toaster';
import Provider from '@/components/layoutv1/provider';

import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-primary' });

export const metadata: Metadata = {
  title: 'Unify video',
  description: 'Unify video',
  openGraph: {
    title: 'Unify video',
    description: 'Unify video',
    images: [
      {
        url: '/manson-affiliate-banner.png',
        width: 800,
        height: 600,
        alt: 'Unify video'
      }
    ]
  }
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body
        className={cn(inter.variable, 'font-primary')}
        suppressHydrationWarning
      >
        <Provider> {children}</Provider>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
