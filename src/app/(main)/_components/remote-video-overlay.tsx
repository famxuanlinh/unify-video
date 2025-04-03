'use client';

import { usePeer } from '@/hooks';
import { useMainStore } from '@/store';
import { getImageUrl, parseToUsername } from '@/utils';
import React from 'react';

import {
  Avatar,
  AvatarImage,
  MicSlashIcon,
  NextIcon,
  VerifiedBadgeIcon
} from '@/components';

export const RemoteVideoOverlay = () => {
  const { skip } = usePeer();
  const { incomingUserInfo, isIncomingMicOn } = useMainStore();

  const userName = incomingUserInfo?.fullName
    ? incomingUserInfo?.fullName
    : parseToUsername(incomingUserInfo?.userId as string);

  return (
    <div className="flex h-full flex-col items-center justify-end">
      {incomingUserInfo ? (
        <>
          <div className="absolute top-4 left-4 z-20 flex h-8 items-center space-x-2 rounded-full bg-black/20 p-1 !pr-2.5">
            <Avatar className="size-6">
              <AvatarImage
                className="rounded-full object-cover"
                src={
                  getImageUrl(incomingUserInfo?.avatar) ||
                  '/images/avatar-default.png'
                }
              />
            </Avatar>
            <p className="text-body-m text-white"> {userName}asdasdasdsad</p>
          </div>
          <div className="absolute top-5 right-4 z-20">
            {isIncomingMicOn === false ? (
              <MicSlashIcon className="size-5 fill-white" />
            ) : null}
          </div>
        </>
      ) : null}
      <div className="flex w-full items-center justify-between bg-gradient-to-b from-black/0 to-black p-6">
        <div>
          <div className="mt-4 flex items-center justify-center">
            <p className="text-head-li text-white">Eleanor Pena</p>{' '}
            <VerifiedBadgeIcon className="ml-2" />
          </div>
          <p className="text-body-m text-light-grey mt-1">TORONTO • 5KM AWAY</p>
        </div>
        <button
          onClick={() => skip()}
          className="z-50 flex size-10 cursor-pointer items-center justify-center rounded-full text-white transition-all"
        >
          <NextIcon />
        </button>
      </div>
    </div>
  );
};
