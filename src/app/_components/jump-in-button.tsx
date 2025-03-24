'use client';

import { toast, usePeer } from '@/hooks';
import { useAuthStore, useMainStore, useSocketStore } from '@/store';
import { VideoIcon } from 'lucide-react';
import React from 'react';

export const JumpInButton = () => {
  const { started } = useMainStore();
  const { ready } = useMainStore();
  const { join } = usePeer();
  const { socket } = useSocketStore();

  const { me } = useAuthStore();

  const isReady = ready && socket?.connect;

  const handleJumpIn = () => {
    if (me) {
      join();
    } else {
      toast({
        description: 'Please signin first'
      });
    }
  };

  return (
    <div className="absolute left-1/2 z-9 -translate-x-1/2 transform space-x-1 portrait:top-1/2 portrait:-translate-y-1/2 landscape:bottom-20">
      {!started && (
        <button
          // disabled={!isReady}
          className={`flex cursor-pointer items-center gap-3 rounded-full px-8 py-3 text-[.9rem] font-medium text-black hover:text-black sm:px-6 sm:py-4 sm:text-base ${isReady ? 'bg-[#fffc03] hover:bg-[#fff06b]' : 'bg-gray-300'}`}
          onClick={handleJumpIn}
        >
          <VideoIcon className="text-xl md:text-2xl" />
          <span className="flex-none">Jump In</span>
        </button>
      )}
    </div>
  );
};
