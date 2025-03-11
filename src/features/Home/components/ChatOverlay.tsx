import React from 'react';

import { EndCallButton } from './EndCallButton';
import { MessageInput } from './MessageInput';
import { MessagesBox } from './MessagesBox';

const ChatOverlay = () => {
  return (
    <div className="flex flex-col h-full p-8 gap-5">
      <EndCallButton />

      <MessagesBox />

      <MessageInput />
    </div>
  );
};

export default ChatOverlay;
