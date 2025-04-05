'use client';

import React, { FC, RefObject } from 'react';

interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  isLocal?: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
}

export const VideoPlayer: FC<VideoPlayerProps> = ({
  isLocal = true,
  videoRef,
  ...props
}) => {
  return (
    <>
      <video
        autoPlay
        playsInline
        ref={videoRef}
        className={
          'absolute top-0 left-0 h-full w-full rounded-4xl object-cover ' +
          (isLocal ? 'p-0.5' : '') +
          (isLocal ? ' scale-x-[-1] transform' : '')
        }
        {...props}
      />
    </>
  );
};
