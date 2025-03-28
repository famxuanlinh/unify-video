import { LocalSide, RemoteSide } from '@/app/(main)/_components';
import React from 'react';

import { JumpInButton } from './jump-in-button';

export const HomePage = () => {
  return (
    <div
      style={{ height: '100svh' }}
      className="flex w-screen flex-col bg-gray-500 landscape:flex-row"
    >
      <RemoteSide />
      <LocalSide />
      <JumpInButton />
      {/* <DiagnosticOverlay /> */}
    </div>
  );
};
