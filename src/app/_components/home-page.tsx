import { LocalSide, DiagnosticOverlay, RemoteSide } from '@/app/_components';
import React from 'react';

export const HomePage = () => {
  return (
    <>
      <RemoteSide />
      {/* <MyComponent /> */}

      <LocalSide />
      {/* <StartVideoChatOverlay /> */}

      <DiagnosticOverlay />
    </>
  );
};
