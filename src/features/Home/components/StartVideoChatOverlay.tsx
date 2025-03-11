'use client';

import usePeer from '@/hooks/usePeer';
import useMainStore from '@/store/mainProvider';
import { User, VideoIcon } from 'lucide-react';
import React from 'react';

export const StartVideoChatOverlay = () => {
  const { join } = usePeer();
  const { onlineUsersCount } = useMainStore();

  return (
    <div className="flex h-full items-center justify-center flex-col">
      <User className="md:text-4xl text-2xl mb-2 text-yellow-400" />

      <p className="text-center text-white sm:text-lg text-sm sm:mb-16 mb-8 ">
        {onlineUsersCount === 1
          ? 'You are the only user online'
          : onlineUsersCount === 2
            ? `${onlineUsersCount - 1} user online`
            : `${onlineUsersCount - 1} users online`}
      </p>

      <button
        className="bg-[#fffc03] text-black sm:text-base text-[.9rem] sm:px-14 sm:py-4 py-3 px-8 rounded-full font-medium flex items-center gap-3 hover:bg-[#fff06b] hover:text-black"
        onClick={async () => await join()}
      >
        <VideoIcon className="md:text-2xl text-xl" />
        Start Video Chat
      </button>
    </div>
  );
};
