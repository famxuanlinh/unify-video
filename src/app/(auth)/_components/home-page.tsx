'use client';

import { LocalSide, RemoteSide, StartOverlay } from '@/app/(auth)/_components';
import { usePeer } from '@/hooks';
import { useMainStore, useMessagingStore } from '@/store';
import React from 'react';

import { ArrowLeft, ChatIcon } from '@/components';

export const HomePage = () => {
  const { started } = useMainStore();
  const { handleEndCall } = usePeer();
  const { messages, changeStatusMessages, isShowChat, setIsShowChat } =
    useMessagingStore();

  const isNewestMessage = messages.findIndex(item => item.isNewest);

  const handleShowChat = () => {
    setIsShowChat();
    changeStatusMessages();
  };

  return (
    <div style={{ height: '100svh' }} className="w-screen bg-black">
      {started ? (
        <>
          <div className="mb-2 flex h-10 items-center justify-between px-4 pt-1">
            <div onClick={handleEndCall}>
              <ArrowLeft className="fill-white" />
            </div>
            <div
              onClick={handleShowChat}
              className={`relative flex size-10 items-center justify-center ${isShowChat ? 'rounded-full bg-white/16' : ''}`}
            >
              <ChatIcon />
              {isNewestMessage >= 0 && !isShowChat && (
                <div className="bg-red absolute right-2.5 bottom-2.5 size-[5px] rounded-full"></div>
              )}
            </div>
          </div>
          <div className="flex h-[calc(100%-40px-16px)] flex-col gap-2 landscape:flex-row">
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
