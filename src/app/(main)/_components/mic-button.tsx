'use client';

import { MEDIA_STATUS } from '@/constants';
import { usePeer } from '@/hooks';
import { useMainStore, usePeerStore } from '@/store';
import React from 'react';

import { MicIcon, MicSlashIcon } from '@/components';

export const MicButton = () => {
  const { setIsMicOn, isMicOn } = useMainStore();
  const { localStream } = usePeerStore();
  const { send } = usePeer();

  const toggleMic = () => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
      send({
        type: MEDIA_STATUS.MIC_STATUS,
        isMicOn: audioTrack.enabled
      });
    }
  };

  return (
    <button
      onClick={() => toggleMic()}
      className={`flex size-10 items-center justify-center rounded-full opacity-60 transition-all ${isMicOn ? 'bg-black/20' : 'bg-red/10'}`}
    >
      {!isMicOn ? (
        <MicSlashIcon className="fill-red size-5" />
      ) : (
        <MicIcon className="size-5 fill-white" />
      )}
    </button>
  );
};
