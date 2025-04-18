'use client';

import { LocalSide, RemoteSide, StartOverlay } from '@/app/(auth)/_components';
import { usePeer } from '@/hooks';
import { useMainStore, useMessagingStore } from '@/store';
import React from 'react';

import { ArrowLeft, ChatIcon } from '@/components';

export const HomePage = () => {
  const { started, waitingForMatch } = useMainStore();
  const { handleEndCall } = usePeer();
  const { messages, changeStatusMessages, isShowChat, setIsShowChat } =
    useMessagingStore();

  const isNewestMessage = messages.findIndex(item => item.isNewest);

  const handleShowChat = () => {
    setIsShowChat();
    changeStatusMessages();
  };

  return (
    <div className="h-screen w-screen bg-black">
      {started ? (
        <div className="flex h-screen w-screen flex-col p-3 pt-0 md:p-10">
          <div className="flex items-center justify-between pt-1 pb-2 max-md:h-10 md:pb-6">
            <div onClick={handleEndCall} className="cursor-pointer md:py-3">
              <ArrowLeft className="fill-white" />
            </div>
            {!waitingForMatch ? (
              <div
                onClick={handleShowChat}
                className={`relative flex size-10 cursor-pointer items-center justify-center md:py-3 ${isShowChat ? 'rounded-full bg-white/16' : ''}`}
              >
                <ChatIcon />
                {isNewestMessage >= 0 && !isShowChat && (
                  <div className="bg-red absolute right-2.5 bottom-2.5 size-[5px] rounded-full"></div>
                )}
              </div>
            ) : (
              <p></p>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2 md:gap-6 landscape:flex-row">
            <RemoteSide />
            <LocalSide isShowChat={isShowChat} />
          </div>
        </div>
      ) : (
        <StartOverlay />
      )}
      {/* <JumpInButton /> */}

      {/* <DiagnosticOverlay /> */}
    </div>
  );
};
