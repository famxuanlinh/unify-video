import '@/styles/globals.css';
import { Metadata } from 'next';
import type { Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

import { PublicLayout } from '@/components';

import { cn } from '@/lib';

const inter = Inter({ subsets: ['latin'], variable: '--font-primary' });

export const metadata: Metadata = {
  title: 'Unify video',
  metadataBase: new URL('https://unify.com'),
  description: 'Unify video',
  openGraph: {
    title: 'Unify video',
    description: 'Unify video',
    images: [
      {
        url: '',
        width: 800,
        height: 600,
        alt: 'Unify video'
      }
    ]
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
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
        <PublicLayout> {children}</PublicLayout>
      </body>
    </html>
  );
};

export default RootLayout;
