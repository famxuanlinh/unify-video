'use client';

import {
  LoadingOverlay,
  RemoteVideoOverlay,
  WelcomeOverlay
} from '@/app/_components';
import { useMainStore, usePeerStore } from '@/store';
import React, { useEffect, useRef } from 'react';

import { Side } from '@/components';

export const RemoteSide = () => {
  const { started, loading, waitingForMatch } = useMainStore();
  const { remoteStreamRef } = usePeerStore();

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (remoteStreamRef && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef;
    } else if (!remoteStreamRef && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }, [remoteStreamRef]);

  function renderOverlay() {
    if (loading) return <LoadingOverlay />;

    if (waitingForMatch)
      return <LoadingOverlay message="Waiting for a match..." />;

    if (!started) return <WelcomeOverlay />;

    return <RemoteVideoOverlay />;
  }

  return (
    <Side videoRef={remoteVideoRef} isLocal={false}>
      {renderOverlay()}
    </Side>
  );
};
