'use client';

import React, { FC, RefObject, useEffect, useRef } from 'react';

interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  isLocal?: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
}

export const VideoPlayer: FC<VideoPlayerProps> = ({
  isLocal = true,
  videoRef,
  ...props
}) => {
  // const videoPlayerRef = useRef<HTMLVideoElement>(null);

  // useEffect(() => {
  //   if (videoRef && videoPlayerRef.current) {
  //     videoPlayerRef.current.srcObject = videoRef;
  //   }
  // }, [videoRef]);

  return (
    <video
      autoPlay
      playsInline
      ref={videoRef}
      className={
        'absolute top-0 left-0 h-full w-full object-cover ' +
        (isLocal ? 'bg-[#07012c]' : 'bg-[#644af1]') +
        (isLocal ? ' scale-x-[-1] transform' : '')
      }
      {...props}
    />
  );
};
