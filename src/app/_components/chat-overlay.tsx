import { EndCallButton, MessageInput, MessagesBox } from '@/app/_components';
import React from 'react';

export const ChatOverlay = () => {
  return (
    <div className="flex h-full flex-col gap-5 p-8">
      <EndCallButton />

      <MessagesBox />

      <MessageInput />
    </div>
  );
};
