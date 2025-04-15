'use client';

import React from 'react';

import { LobbyNoDataIcon } from '@/components/icons/lobby-nodata-icon';

export const LobbyNoData = () => {
  return (
    <div className="relative h-screen px-4">
      <div className="mt-[49px] flex flex-col justify-center gap-4 px-10 text-center">
        <div className="flex cursor-pointer justify-center">
          <LobbyNoDataIcon className="cursor-pointer" />
        </div>
        <div className="text-dark-grey text-lg font-semibold">
          Your Next Connection Awaits
        </div>
        <div className="text-light-grey text-xs font-light">
          No matches or friends yet? Every chat is a chance to meet someone
          amazing. Start now and see who’s out there!
        </div>
      </div>
    </div>
  );
};
