'use client';

import useMainStore from '@/store/main-provider';
import usePeerStore from '@/store/peer-provider';
import React from 'react';

import { Side } from '@/components/layout/side';

import { LoadingOverlay } from './loading-overlay';
import { RemoteVideoOverlay } from './remote-video-overlay';
import { WelcomeOverlay } from './welcome-overlay';

export const RemoteSide = () => {
  const { started, loading, waitingForMatch } = useMainStore();

  const { remoteStream } = usePeerStore();

  function renderOverlay() {
    if (loading) {
      return <LoadingOverlay />;
    }

    if (waitingForMatch) {
      return <LoadingOverlay message="Waiting for a match..." />;
    }

    if (!started) {
      return <WelcomeOverlay />;
    }

    return <RemoteVideoOverlay />;
  }

  return (
    <Side videoRef={remoteStream} isLocal={false}>
      {renderOverlay()}
    </Side>
  );
};
