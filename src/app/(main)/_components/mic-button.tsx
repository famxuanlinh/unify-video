'use client';

import { MEDIA_STATUS } from '@/constants';
import { usePeer } from '@/hooks';
import { useMainStore, usePeerStore } from '@/store';
import { Mic, MicOff } from 'lucide-react';
import React from 'react';

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
      className={`w-fit self-center rounded-full p-3 opacity-60 transition-all hover:scale-110 hover:opacity-100 ${isMicOn ? 'bg-gray-100/10 text-white' : 'bg-white/90 text-gray-900'}`}
    >
      {isMicOn ? <MicOff className="size-4.5" /> : <Mic className="size-4.5" />}
    </button>
  );
};
