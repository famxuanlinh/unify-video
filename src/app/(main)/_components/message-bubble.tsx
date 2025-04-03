import { Message } from '@/store';
import React from 'react';

import { Avatar, AvatarImage } from '@/components';

export const MessageBubble = ({ message }: { message: Message }) => {
  // const { incomingUserInfo } = useMainStore();

  return (
    <div
      className={`flex items-center gap-2 ${message.isMine ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!message.isMine ? (
        <Avatar className="size-6">
          <AvatarImage
            className="rounded-full object-cover"
            src={'/images/avatar-default.png'}
          />
        </Avatar>
      ) : null}

      <div className="text-body-m flex min-h-10 max-w-[200px] items-center rounded-full bg-black/20 px-3 py-2.5 break-words text-white">
        {message.text}
      </div>
    </div>
  );
};
