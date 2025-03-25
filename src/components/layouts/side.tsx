'use client';

import { useMainStore } from '@/store';
import { getImageUrl, parseToUsername } from '@/utils';
import { MicOff } from 'lucide-react';
import React, { FC, ReactNode, RefObject } from 'react';

import { Avatar, AvatarFallback, AvatarImage, VideoPlayer } from '@/components';

interface SideProps {
  videoRef?: RefObject<HTMLVideoElement | null>;
  children?: ReactNode;
  className?: string;
  isLocal?: boolean;
}

const SideComponent: FC<SideProps> = ({
  videoRef,
  children,
  className = '',
  isLocal = true
}) => {
  const { incomingUserInfo, isIncomingMicOn } = useMainStore();

  const userName = incomingUserInfo?.fullName
    ? incomingUserInfo?.fullName
    : parseToUsername(incomingUserInfo?.userId as string);

  return (
    <div className={`relative portrait:h-1/2 landscape:w-1/2 ${className}`}>
      {!isLocal && incomingUserInfo ? (
        <>
          <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
            <Avatar className="size-10">
              <AvatarImage
                className="object-cover"
                src={getImageUrl(incomingUserInfo?.avatar)}
              />
              <AvatarFallback>{userName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <p> {userName}</p>
          </div>
          <div className="absolute right-4 bottom-4 z-50">
            {isIncomingMicOn === false ? (
              <MicOff className="size-4.5 text-white" />
            ) : null}
          </div>
        </>
      ) : null}
      {videoRef && (
        <VideoPlayer videoRef={videoRef} isLocal={isLocal} muted={isLocal} />
      )}
      <div className="absolute top-0 left-0 h-full w-full">{children}</div>
    </div>
  );
};

export const Side = React.memo(SideComponent);
