'use client';

import { MiniKit } from '@worldcoin/minikit-js';
import React, { useEffect } from 'react';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    MiniKit.install();
  }, []);

  return <>{children}</>;
};
