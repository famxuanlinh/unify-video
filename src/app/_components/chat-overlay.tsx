import React from 'react';

import { EndCallButton } from './end-call-button';
import { MessageInput } from './message-input';
import { MessagesBox } from './messages-box';

const ChatOverlay = () => {
  return (
    <div className="flex h-full flex-col gap-5 p-8">
      <EndCallButton />

      <MessagesBox />

      <MessageInput />
    </div>
  );
};

export default ChatOverlay;
