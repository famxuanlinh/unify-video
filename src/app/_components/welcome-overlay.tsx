import React from 'react';

import { LoginButton } from '@/components';

export const WelcomeOverlay = () => {
  return (
    <div className="relative flex h-full flex-col items-center justify-center text-center text-white">
      <div className="absolute top-4 right-4">
        {' '}
        <LoginButton />
      </div>

      <div className="mb-2 text-2xl font-medium sm:text-3xl">Unify</div>
      <div className="text-md mt-2 sm:text-lg">
        Make new friends <br />
        face-to-face
      </div>
    </div>
  );
};
