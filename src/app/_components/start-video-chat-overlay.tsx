'use client';

import usePeer from '@/hooks/use-peer';
import useMainStore from '@/store/main-provider';
import { User, VideoIcon } from 'lucide-react';
import React from 'react';

export const StartVideoChatOverlay = () => {
  const { join } = usePeer();
  const { onlineUsersCount } = useMainStore();

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <User className="mb-2 text-2xl text-yellow-400 md:text-4xl" />

      <p className="mb-8 text-center text-sm text-white sm:mb-16 sm:text-lg">
        {onlineUsersCount === 1
          ? 'You are the only user online'
          : onlineUsersCount === 2
            ? `${onlineUsersCount - 1} user online`
            : `${onlineUsersCount - 1} users online`}
      </p>

      <button
        className="flex items-center gap-3 rounded-full bg-[#fffc03] px-8 py-3 text-[.9rem] font-medium text-black hover:bg-[#fff06b] hover:text-black sm:px-14 sm:py-4 sm:text-base"
        onClick={async () => await join()}
      >
        <VideoIcon className="text-xl md:text-2xl" />
        Start Video Chat
      </button>
    </div>
  );
};
