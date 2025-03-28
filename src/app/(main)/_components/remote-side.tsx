'use client';

import {
  LoadingOverlay,
  RemoteVideoOverlay,
  WelcomeOverlay
} from '@/app/(main)/_components';
import { useMainStore, usePeerStore } from '@/store';
import React, { useEffect, useRef } from 'react';

import { Side } from '@/components';

export const RemoteSide = () => {
  const { started, loading, waitingForMatch } = useMainStore();
  const { remoteStream } = usePeerStore();

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    } else if (!remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }, [remoteStream]);

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
