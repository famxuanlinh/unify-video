'use client';

import { usePeer } from '@/hooks';
import { SkipBackIcon } from 'lucide-react';
import React from 'react';

export const RemoteVideoOverlay = () => {
  const { skip } = usePeer();

  return (
    <div className="flex h-full flex-col items-center justify-end pb-8">
      <button
        onClick={() => skip()}
        className="bg-primary w-fit self-center rounded-full border-2 p-2 text-white opacity-90 hover:scale-110 hover:opacity-100"
      >
        <SkipBackIcon className="rotate-180" size={26} />
      </button>
    </div>
  );
};
