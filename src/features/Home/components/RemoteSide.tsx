'use client';

import useMainStore from '@/store/mainProvider';
import usePeerStore from '@/store/peerProvider';
import React from 'react';

import { Side } from '@/components/Layout/Side';

import { LoadingOverlay } from './LoadingOverlay';
import { RemoteVideoOverlay } from './RemoteVideoOverlay';
import { WelcomeOverlay } from './WelcomeOverlay';

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
