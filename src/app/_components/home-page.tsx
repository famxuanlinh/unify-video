import { LocalSide, DiagnosticOverlay, RemoteSide } from '@/app/_components';
import React from 'react';

import { StartVideoCallButton } from './start-video-call-button';

export const HomePage = () => {
  return (
    <div
      style={{ height: '100svh' }}
      className="flex w-screen flex-col bg-gray-500 landscape:flex-row"
    >
      <RemoteSide />

      <LocalSide />
      <StartVideoCallButton />

      <DiagnosticOverlay />
    </div>
  );
};
