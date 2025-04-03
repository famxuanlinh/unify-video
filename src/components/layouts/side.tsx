'use client';

import React, { FC, ReactNode, RefObject } from 'react';

import { VideoPlayer } from '@/components';

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
  return (
    <div
      className={`relative rounded-4xl max-md:mx-3 md:mx-2 portrait:h-1/2 landscape:w-1/2 ${className}`}
    >
      {videoRef && (
        <VideoPlayer videoRef={videoRef} isLocal={isLocal} muted={isLocal} />
      )}
      <div className="absolute top-0 left-0 h-full w-full">{children}</div>
    </div>
  );
};

export const Side = React.memo(SideComponent);
