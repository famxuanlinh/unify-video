import {
  EndCallButton,
  MessageInput,
  MessagesBox,
  CameraButton,
  MicButton
} from '@/app/(auth)/_components';
import { useAuthStore, useMainStore } from '@/store';
import { getImageUrl } from '@/utils';
import React from 'react';

import { Avatar, AvatarImage } from '@/components';

export const ChatOverlay = ({ isShowChat }: { isShowChat: boolean }) => {
  const { waitingForMatch } = useMainStore();
  const { me } = useAuthStore();

  return (
    <div
      className={`shadow-color m-0.5 flex h-[calc(100%-4px)] flex-col justify-start gap-3 rounded-4xl p-4 ${!isShowChat && waitingForMatch ? '' : 'justify-center'}`}
    >
      <div className="absolute top-4 left-4 z-20 flex h-8 items-center space-x-2 rounded-full bg-black/20 p-1 !pr-2.5">
        <Avatar className="size-6">
          <AvatarImage
            className="rounded-full object-cover"
            src={getImageUrl(me?.avatar) || '/images/avatar-default.png'}
          />
        </Avatar>
        <p className="text-body-m text-white"> you</p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <CameraButton />
        <MicButton />
        <EndCallButton />
      </div>

      {!waitingForMatch && isShowChat ? (
        <>
          <MessagesBox />

          <MessageInput />
        </>
      ) : (
        <p></p>
      )}
    </div>
  );
};
