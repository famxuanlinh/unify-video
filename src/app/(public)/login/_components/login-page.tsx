import Image from 'next/image';
import React from 'react';

import { Button } from '@/components';

export const LoginPage = () => {
  return (
    <div
      className={`relative flex h-screen flex-col justify-end bg-[url(/images/main-bg.png)] bg-cover`}
    >
      <div className="relative h-full w-full">
        <Image
          src="/images/login-img.png"
          alt="login"
          fill
          className="size-full object-cover"
        />
      </div>
      <div className="p-8 pt-0 text-white">
        <h1 className="pb-2 text-[28px] font-semibold">UNIFY</h1>
        <p className="mb-16 text-xs font-light">
          Meet new people, make friends, or find a date—all through real-time
          video chats. Whether you&apos;re here for fun connections or something
          more, Unify makes it easy to match, chat, and vibe instantly.
        </p>

        <Button variant="secondary" className="w-full">
          {' '}
          Join now
        </Button>
      </div>
    </div>
  );
};
