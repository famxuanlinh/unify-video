'use client';

import {
  ChatOverlay,
  ErrorOverlay,
  LoadingOverlay
} from '@/app/(auth)/_components';
import { MEDIA_STATUS } from '@/constants';
import { usePeer } from '@/hooks';
import { useMainStore, usePeerStore } from '@/store';
import React, { useEffect, useRef } from 'react';

import { Side } from '@/components';

export const LocalSide = ({ isShowChat }: { isShowChat: boolean }) => {
  const { loading, error } = useMainStore();
  const { localStream } = usePeerStore();
  const { send } = usePeer();

  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    } else if (!localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  }, [localStream]);

  useEffect(() => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack && !audioTrack.enabled) {
      send({
        type: MEDIA_STATUS.MIC_STATUS,
        isMicOn: !audioTrack.enabled
      });
    }
  }, []);

  const renderOverlay = () => {
    if (error) {
      return <ErrorOverlay />;
    }

    if (loading) {
      return <LoadingOverlay />;
    }

    // if (started) {
    //   return <StartVideoChatOverlay />;
    // }

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
