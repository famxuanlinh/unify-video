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
  const { localStreamRef } = usePeerStore();

  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localStreamRef && localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef;
    } else if (!localStreamRef && localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  }, [localStreamRef]);

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
