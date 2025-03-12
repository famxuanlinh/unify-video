'use client';

import usePeer from '@/hooks/use-peer';
import { PhoneOffIcon } from 'lucide-react';
import React from 'react';

export const EndCallButton = () => {
  const { end } = usePeer();

  return (
    <button
      onClick={() => end()}
      className="w-fit self-center rounded-full bg-red-600 p-3 text-white opacity-60 hover:scale-110 hover:opacity-100"
    >
      <PhoneOffIcon size={18} />
    </button>
  );
};
