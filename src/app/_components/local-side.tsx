'use client';

import {
  ChatOverlay,
  ErrorOverlay,
  LoadingOverlay,
  StartVideoChatOverlay
} from '@/app/_components';
import { useMainStore, usePeerStore } from '@/store';
import React, { useEffect, useRef } from 'react';

import { Side } from '@/components';

export const LocalSide = () => {
  const { started, loading, error } = useMainStore();
  const { localStream } = usePeerStore();

  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    } else if (!localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  }, [localStream]);

  const renderOverlay = () => {
    if (error) {
      return <ErrorOverlay message={error} />;
    }

    if (loading) {
      return <LoadingOverlay />;
    }

    if (!started) {
      return <StartVideoChatOverlay />;
    }

    return <ChatOverlay />;
  };

  return <Side videoRef={localVideoRef}>{renderOverlay()}</Side>;
};
