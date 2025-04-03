'use client';

import { LocalSide, RemoteSide, StartOverlay } from '@/app/(main)/_components';
import { useMainStore } from '@/store';
import React, { useState } from 'react';

import { ArrowLeft, ChatIcon } from '@/components';

export const HomePage = () => {
  const [isShowChat, setIsShowChat] = useState(false);
  const { started } = useMainStore();

  return (
    <div style={{ height: '100svh' }} className="w-screen bg-black">
      {!started ? (
        <>
          <div className="mb-2 flex h-10 items-center justify-between px-4 pt-1">
            <div>
              <ArrowLeft className="fill-white" />
            </div>
            <div
              onClick={() => setIsShowChat(!isShowChat)}
              className={`flex size-10 items-center justify-center ${isShowChat ? 'rounded-full bg-white/16' : ''}`}
            >
              <ChatIcon />
            </div>
          </div>
          <div className="flex h-[calc(100%-40px-16px)] flex-col landscape:flex-row">
            <RemoteSide />
            <LocalSide isShowChat={isShowChat} />
          </div>
        </>
      ) : (
        <StartOverlay />
      )}
      {/* <JumpInButton /> */}

      {/* <DiagnosticOverlay /> */}
    </div>
  );
};
