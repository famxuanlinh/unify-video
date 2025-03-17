import { LocalSide, DiagnosticOverlay, RemoteSide } from '@/app/_components';
import React from 'react';

import { StartVideoCallButton } from './start-video-call-button';

export const HomePage = () => {
  return (
    <>
      <RemoteSide />

      <LocalSide />
      <StartVideoCallButton />

      <DiagnosticOverlay />
    </>
  );
};
