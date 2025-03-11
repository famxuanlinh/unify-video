'use client';

import React, { FC, ReactNode } from 'react';

import VideoPlayer from '../VideoPlayer';

interface SideProps {
  videoRef?: MediaStream | null;
  children?: ReactNode;
  className?: string;
  isLocal?: boolean;
}

const SideComponent: FC<SideProps> = ({ videoRef, children, className = '', isLocal = true }) => {
  return (
    <div
      className={`relative landscape:w-1/2 portrait:h-1/2 ${className} ${isLocal ? '' : 'bg-[#644af1]'}`}
    >
      {videoRef && <VideoPlayer videoRef={videoRef} isLocal={isLocal} muted={isLocal} />}
      <div className="w-full h-full top-0 left-0 absolute z-100">{children}</div>
    </div>
  );
};

export const Side = React.memo(SideComponent);
