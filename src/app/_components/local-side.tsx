'use client';

import useMainStore from '@/store/main-provider';
import usePeerStore from '@/store/peer-provider';
import React from 'react';

import { Side } from '@/components/layoutv1/side';

import ChatOverlay from './chat-overlay';
import { ErrorOverlay } from './error-overlay';
import { LoadingOverlay } from './loading-overlay';
import { StartVideoChatOverlay } from './start-video-chat-overlay';

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
