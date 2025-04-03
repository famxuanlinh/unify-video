'use client';

import {
  ChatOverlay,
  ErrorOverlay,
  LoadingOverlay,
  StartVideoChatOverlay
} from '@/app/(main)/_components';
import { useMainStore, usePeerStore } from '@/store';
import React, { useEffect, useRef } from 'react';

import { Side } from '@/components';

export const LocalSide = ({ isShowChat }: { isShowChat: boolean }) => {
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
      return <ErrorOverlay />;
    }

    if (loading) {
      return <LoadingOverlay />;
    }

    if (started) {
      return <StartVideoChatOverlay />;
    }

    return <ChatOverlay isShowChat={isShowChat} />;
  };

  return (
    <Side
      className="from-orange to-red bg-gradient-to-b"
      videoRef={localVideoRef}
    >
      {renderOverlay()}
    </Side>
  );
};
