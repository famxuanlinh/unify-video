'use client';

import { usePeer } from '@/hooks';
import React from 'react';

import { PhoneXIcon } from '@/components';

export const EndCallButton = () => {
  const { end } = usePeer();

  return (
    <button
      onClick={() => end()}
      className="bg-red flex size-10 items-center justify-center rounded-full"
    >
      <PhoneXIcon />
    </button>
  );
};
