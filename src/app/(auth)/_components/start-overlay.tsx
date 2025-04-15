'use client';

import { usePeer } from '@/hooks';
import { useMainStore, useSocketStore } from '@/store';
import Image from 'next/image';
import React from 'react';

import { Button, VideoCameraIcon } from '@/components';

import { Header } from './header';

export const StartOverlay = () => {
  const { ready, error } = useMainStore();
  const { socket } = useSocketStore();
  const { join } = usePeer();

  const isReady = ready && socket?.connect;

  const handleJumpIn = () => {
    if (error) {
      window.location.reload();
    }

    if (isReady) {
      join();
    }
  };

  return (
    <div className="relative flex h-screen flex-col justify-end bg-white">
      <Header />
      <div className="relative h-full w-full">
        <Image
          src="/images/start-img.png"
          alt="login"
          fill
          className="size-full object-cover"
        />
      </div>
      <div className="px-4 pb-6">
        <h1 className="text-dark-grey pb-2 text-center text-[28px] font-semibold">
          Ready to Meet Someone New?
        </h1>
        <p className="text-light-grey mb-10 text-center text-xs font-light">
          Exciting connections are just one tap away. Whether you&apos;re here
          to make friends or find something more, every chat is a new
          opportunity!
        </p>

        <Button
          loading={Boolean(!isReady)}
          className="w-full"
          onClick={handleJumpIn}
        >
          <VideoCameraIcon className="mr-2" />
          Jump In
        </Button>
      </div>
    </div>
  );
};
