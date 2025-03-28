'use client';

import { usePeer } from '@/hooks';
import { Phone } from 'lucide-react';
import React from 'react';

export const EndCallButton = () => {
  const { end } = usePeer();

  return (
    <button
      onClick={() => end()}
      className="w-fit self-center rounded-full bg-red-600 p-3 text-white opacity-60 transition-all hover:scale-110 hover:opacity-100"
    >
      <Phone size={18} />
    </button>
  );
};
