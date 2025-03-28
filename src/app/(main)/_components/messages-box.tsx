import { MessageBubble } from '@/app/(main)/_components';
import { useMessagingStore } from '@/store';
import React from 'react';

export const MessagesBox = () => {
  const { messages } = useMessagingStore();

  return (
    <div
      id="scroll-hide"
      className="flex flex-1 flex-col-reverse gap-2 overflow-y-auto"
    >
      {messages.map((message, index) => {
        return <MessageBubble message={message} key={index} />;
      })}
    </div>
  );
};
