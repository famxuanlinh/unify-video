import { EndCallButton, MessageInput, MessagesBox } from '@/app/_components';
import { useMainStore } from '@/store';
import React from 'react';

export const ChatOverlay = () => {
  const { waitingForMatch } = useMainStore();

  return (
    <div className="flex h-full flex-col gap-5 p-8 max-md:pt-5">
      <EndCallButton />

      {!waitingForMatch && (
        <>
          <MessagesBox />

          <MessageInput />
        </>
      )}
    </div>
  );
};
