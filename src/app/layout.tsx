import '@/styles/globals.css';
import UnifyApi from '@/apis';
import { AUTH_TOKEN_KEY } from '@/constants';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';

import { MainLayout, Toaster } from '@/components';

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

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  let me = null;

  const cookieStore = await cookies();
  const tokensRaw = cookieStore.get(AUTH_TOKEN_KEY);

  if (tokensRaw) {
    try {
      me = await UnifyApi.user.get();
    } catch (e) {
      console.log('MainLayout', e);
    }
  }

  return (
    <html lang="en">
      <body
        className={cn(inter.variable, 'font-primary')}
        suppressHydrationWarning
      >
        <MainLayout me={me}>{children}</MainLayout>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
