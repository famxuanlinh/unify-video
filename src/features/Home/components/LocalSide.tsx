'use client';

import useMainStore from '@/store/mainProvider';
import usePeerStore from '@/store/peerProvider';
import React from 'react';

import { Side } from '@/components/Layout/Side';

import ChatOverlay from './ChatOverlay';
import { ErrorOverlay } from './ErrorOverlay';
import { LoadingOverlay } from './LoadingOverlay';
import { StartVideoChatOverlay } from './StartVideoChatOverlay';

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
