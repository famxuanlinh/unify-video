'use client';

import { MEDIA_STATUS } from '@/constants';
import { usePeer } from '@/hooks';
import { useMainStore, usePeerStore } from '@/store';
import { Camera, CameraOff } from 'lucide-react';
import React from 'react';

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
      className={`w-fit self-center rounded-full p-3 opacity-60 transition-all hover:scale-110 hover:opacity-100 ${isCameraOn ? 'bg-gray-100/10 text-white' : 'bg-white/90 text-gray-900'}`}
    >
      {isCameraOn ? (
        <CameraOff className="size-4.5" />
      ) : (
        <Camera className="size-4.5" />
      )}
    </button>
  );
};
