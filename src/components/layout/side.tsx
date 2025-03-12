'use client';

import React, { FC, ReactNode } from 'react';

import VideoPlayer from '../video-player';

interface SideProps {
  videoRef?: MediaStream | null;
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
  return (
    <div
      className={`relative portrait:h-1/2 landscape:w-1/2 ${className} ${isLocal ? '' : 'bg-[#644af1]'}`}
    >
      {videoRef && (
        <VideoPlayer videoRef={videoRef} isLocal={isLocal} muted={isLocal} />
      )}
      <div className="absolute top-0 left-0 z-100 h-full w-full">
        {children}
      </div>
    </div>
  );
};

export const Side = React.memo(SideComponent);
