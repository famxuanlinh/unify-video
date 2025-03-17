'use client';

import {
  LoadingOverlay,
  RemoteVideoOverlay,
  WelcomeOverlay
} from '@/app/_components';
import { useMainStore, usePeerStore } from '@/store';
import React from 'react';

import { Side } from '@/components';

export const RemoteSide = () => {
  const { started, loading, waitingForMatch } = useMainStore();
  const { remoteStreamRef } = usePeerStore();

  function renderOverlay() {
    if (loading) return <LoadingOverlay />;

    if (waitingForMatch)
      return <LoadingOverlay message="Waiting for a match..." />;

    if (!started) return <WelcomeOverlay />;

    return <RemoteVideoOverlay />;
  }

  return (
    <Side videoRef={remoteStreamRef} isLocal={false}>
      {renderOverlay()}
    </Side>
  );
};
