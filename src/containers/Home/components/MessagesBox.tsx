import useMessagingStore from '@/store/messageProvider';
import React from 'react';

import { MessageBubble } from './MessageBubble';

export const MessagesBox = () => {
  const { messages } = useMessagingStore();

  return (
    <div className="flex flex-1 flex-col-reverse gap-2 overflow-hidden">
      {messages.map((message, index) => {
        return <MessageBubble message={message} key={index} />;
      })}
    </div>
  );
};
