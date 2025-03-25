import {
  EndCallButton,
  MessageInput,
  MessagesBox,
  CameraButton,
  MicButton
} from '@/app/_components';
import { useMainStore } from '@/store';
import React from 'react';

export const ChatOverlay = () => {
  const { waitingForMatch } = useMainStore();

  return (
    <div className="flex h-full flex-col gap-5 p-8 max-md:pt-5">
      <div className="flex items-center gap-3">
        <EndCallButton />
        <MicButton />
        <CameraButton />
      </div>

      {!waitingForMatch && (
        <>
          <MessagesBox />

          <MessageInput />
        </>
      )}
    </div>
  );
};
