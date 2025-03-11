'use client';

import React, { FC, useEffect, useRef } from 'react';

interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  isLocal?: boolean;
  videoRef: MediaStream | null;
}

const VideoPlayer: FC<VideoPlayerProps> = ({ isLocal = true, videoRef, ...props }) => {
  console.log('🚀 ~ isLocal:', isLocal);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef && videoPlayerRef.current) {
      videoPlayerRef.current.srcObject = videoRef;
    }
  }, [videoRef]);

  return (
    <video
      autoPlay
      playsInline
      ref={videoPlayerRef}
      className={
        'w-full h-full object-cover absolute top-0 left-0 ' +
        (isLocal ? 'bg-[#07012c]' : 'bg-[#644af1]') +
        (isLocal ? ' transform scale-x-[-1]' : '')
      }
      {...props}
    />
  );
};

export default VideoPlayer;
