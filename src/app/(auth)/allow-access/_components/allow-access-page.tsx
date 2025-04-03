import Image from 'next/image';
import React from 'react';

import { Button } from '@/components';

export const AllowAccessPage = () => {
  return (
    <div className="h-screen overflow-hidden">
      <div className="flex h-full flex-col justify-between">
        <div className="px-6 pt-10">
          <h1 className="text-dark-grey pb-4 text-[28px] font-semibold">
            Allow Access to Camera
          </h1>
          <p className="text-light-grey text-xs font-light">
            To start chatting and meeting new people, please allow access to
            your camera and microphone. This ensures a smooth video call
            experience.
          </p>
        </div>

        <div className="relative h-full w-full px-4">
          <Image
            src="/images/cuate.png"
            alt="login"
            fill
            className="size-full object-contain"
          />
        </div>
        <div className="px-4 pb-4">
          {' '}
          <Button className="w-full">Allow Access</Button>
        </div>
      </div>
    </div>
  );
};
