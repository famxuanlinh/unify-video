import { WholeWordIcon } from 'lucide-react';
import React from 'react';

export const WelcomeOverlay = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center text-white">
      <WholeWordIcon
        className="mb-4 text-6xl sm:text-7xl"
        style={{ color: 'dodgerblue' }}
      />
      <div className="mb-2 text-2xl font-medium sm:text-3xl">Unify</div>
      <div className="text-md mt-2 sm:text-lg">
        Make new friends <br />
        face-to-face
      </div>
    </div>
  );
};
