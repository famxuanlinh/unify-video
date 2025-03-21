'use client';

import { usePeer } from '@/hooks';
import { useSocketIO } from '@/hooks/use-socket-io';
import { useMainStore } from '@/store';
import { VideoIcon } from 'lucide-react';
import React from 'react';

export const StartVideoCallButton = () => {
  const { started } = useMainStore();
  const { ready } = useMainStore();
  const { join } = usePeer();
  const { isConnected } = useSocketIO();

  const isReady = isConnected && ready;

  return (
    <div className="absolute left-1/2 z-9 -translate-x-1/2 transform space-x-1 portrait:top-1/2 portrait:-translate-y-1/2 landscape:bottom-20">
      {!started && (
        <button
          disabled={!isReady}
          className={`flex cursor-pointer items-center gap-3 rounded-full px-8 py-3 text-[.9rem] font-medium text-black hover:text-black sm:px-6 sm:py-4 sm:text-base ${isReady ? 'bg-[#fffc03] hover:bg-[#fff06b]' : 'bg-gray-300'}`}
          onClick={join}
        >
          <VideoIcon className="text-xl max-md:hidden md:text-2xl" />
          <span className="flex-none"> Start Video Chat</span>
        </button>
      )}
    </div>
  );
};
