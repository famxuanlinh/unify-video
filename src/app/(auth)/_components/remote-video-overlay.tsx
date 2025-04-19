'use client';

import { usePeer } from '@/hooks';
import { useAuthStore, useMainStore } from '@/store';
import { getDistanceInKm, getImageUrl } from '@/utils';
import { CameraOff } from 'lucide-react';
import React, { useState } from 'react';

import {
  Avatar,
  AvatarImage,
  MicSlashIcon,
  NextIcon,
  VerifiedBadgeIcon
} from '@/components';

export const RemoteVideoOverlay = () => {
  const { handleNextCall } = usePeer();
  const [distance, setDistance] = useState<string | undefined>('');
  const { incomingUserInfo, isIncomingMicOn, isIncomingCameraOn } =
    useMainStore();
  const { me } = useAuthStore();

  React.useEffect(() => {
    if (
      !me ||
      !me.location ||
      !incomingUserInfo ||
      !incomingUserInfo.location
    ) {
      return;
    }
    const distance = getDistanceInKm({
      lat1: me.location.lat as number,
      long1: me.location.long as number,
      lat2: incomingUserInfo.location.lat as number,
      long2: incomingUserInfo.location.long as number
    });
    setDistance(distance);
  }, [me, incomingUserInfo]);

  return (
    <div className="relative flex h-full flex-col items-center justify-end">
      {isIncomingCameraOn === false ? (
        <div className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center rounded-4xl bg-[url(/images/main-bg.png)] bg-cover bg-right-top">
          <CameraOff className="size-20 text-white" />
        </div>
      ) : null}
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
          <p className="text-body-m text-white">
            {' '}
            {incomingUserInfo?.fullName}
          </p>
        </div>
        <div className="absolute top-5 right-6.5 z-20">
          {isIncomingMicOn === false ? (
            <MicSlashIcon className="size-5 fill-white" />
          ) : null}
        </div>
      </>
      <div className="z-50 flex w-full items-center justify-between gap-4 bg-gradient-to-b from-black/0 to-black p-4">
        <div>
          <div className="flex items-center">
            <p className="text-head-li text-white">
              {incomingUserInfo?.fullName}
            </p>
            <VerifiedBadgeIcon className="ml-2" />
          </div>
          <div className="text-body-m text-light-grey mt-1 line-clamp-1 flex items-center">
            <span className="line-clamp-1">
              {incomingUserInfo?.location?.name
                ? `${incomingUserInfo?.location?.name}`
                : ''}
            </span>
            <span className="flex-none">
              {distance ? ` • ${distance} KM` : null}
            </span>
          </div>
        </div>
        <button
          onClick={handleNextCall}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full text-white transition-all"
        >
          <NextIcon />
        </button>
      </div>
    </div>
  );
};
