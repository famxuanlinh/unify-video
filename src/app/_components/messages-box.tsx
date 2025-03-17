import { MessageBubble } from '@/app/_components';
import { useMessagingStore } from '@/store';
import React from 'react';

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
