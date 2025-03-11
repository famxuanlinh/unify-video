'use client';

import usePeer from '@/hooks/usePeer';
import { PhoneOffIcon } from 'lucide-react';
import React from 'react';

export const EndCallButton = () => {
  const { end } = usePeer();

  return (
    <button
      onClick={() => end()}
      className="bg-red-600 text-white p-3 rounded-full w-fit self-center opacity-60 hover:opacity-100 hover:scale-110"
    >
      <PhoneOffIcon size={18} />
    </button>
  );
};
