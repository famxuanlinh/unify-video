'use client';

import { useMainStore } from '@/store';
import React from 'react';

export const StartVideoChatOverlay = () => {
  const { onlineUsersCount } = useMainStore();

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <p className="text-center text-sm text-white sm:text-lg">
        {onlineUsersCount === 1
          ? 'You are the only user online'
          : onlineUsersCount === 2
            ? `${onlineUsersCount - 1} user online`
            : `${onlineUsersCount - 1} users online`}
      </p>
    </div>
  );
};
