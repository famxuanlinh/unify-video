'use client';

import usePeer from '@/hooks/usePeer';
import { SkipBackIcon } from 'lucide-react';
import React from 'react';

export const RemoteVideoOverlay = () => {
  const { skip } = usePeer();

  return (
    <div className="flex justify-end pb-8 items-center flex-col h-full">
      <button
        onClick={() => skip()}
        className="bg-primary border-2 text-white p-2 rounded-full w-fit self-center opacity-90 hover:opacity-100 hover:scale-110"
      >
        <SkipBackIcon size={26} />
      </button>
    </div>
  );
};
