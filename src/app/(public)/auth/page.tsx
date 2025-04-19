import { Viewport } from 'next';
import React from 'react';

import { AuthPage } from './_components';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

const page = () => <AuthPage />;

export default page;
