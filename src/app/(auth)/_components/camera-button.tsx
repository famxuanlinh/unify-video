'use client';

import { MEDIA_STATUS } from '@/constants';
import { usePeer } from '@/hooks';
import { useMainStore, usePeerStore } from '@/store';
import React from 'react';

import { CameraIcon, CameraSlashIcon } from '@/components';

export const CameraButton = () => {
  const { setIsCameraOn, isCameraOn } = useMainStore();
  const { localStream } = usePeerStore();
  const { send } = usePeer();

  const toggleCamera = () => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
      send({
        type: MEDIA_STATUS.CAMERA_STATUS,
        isCameraOn: videoTrack.enabled
      });
    }
  };

  return (
    <button
      onClick={() => toggleCamera()}
      className={`flex size-10 items-center justify-center rounded-full opacity-60 transition-all ${isCameraOn ? 'bg-black/20' : 'bg-red/10'}`}
    >
      {!isCameraOn ? (
        <CameraSlashIcon className="fill-red size-5" />
      ) : (
        <CameraIcon className="size-5 fill-white" />
      )}
    </button>
  );
};
