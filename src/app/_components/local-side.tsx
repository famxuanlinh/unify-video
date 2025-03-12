'use client';

import {
  ChatOverlay,
  ErrorOverlay,
  LoadingOverlay,
  StartVideoChatOverlay
} from '@/app/_components';
import { useMainStore, usePeerStore } from '@/store';
import React from 'react';

import { Side } from '@/components';

export const LocalSide = () => {
  const { started, loading, error } = useMainStore();
  const { localStream } = usePeerStore();

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

  return <Side videoRef={localStream}>{renderOverlay()}</Side>;
};
