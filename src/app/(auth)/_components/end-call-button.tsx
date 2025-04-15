'use client';

import { usePeer } from '@/hooks';
import React from 'react';

import { PhoneXIcon } from '@/components';

export const EndCallButton = () => {
  const { handleEndCall } = usePeer();

  return (
    <button
      onClick={handleEndCall}
      className="bg-red flex size-10 items-center justify-center rounded-full"
    >
      <PhoneXIcon />
    </button>
  );
};
