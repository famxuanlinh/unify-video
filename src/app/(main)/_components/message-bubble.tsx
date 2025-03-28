import { Message, useMainStore } from '@/store';
import { getImageUrl, parseToUsername } from '@/utils';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components';

export const MessageBubble = ({ message }: { message: Message }) => {
  const { incomingUserInfo } = useMainStore();

  return (
    <div
      className={`flex items-center gap-2 ${message.isMine ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!message.isMine ? (
        <Avatar className="size-6">
          <AvatarImage
            className="object-cover"
            src={getImageUrl(incomingUserInfo?.avatar)}
          />
          <AvatarFallback className="text-xs">
            {incomingUserInfo?.fullName?.slice(0, 2) ||
              parseToUsername(incomingUserInfo?.userId as string).slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      ) : null}

      <div className="max-w-[200px] rounded-md bg-[#00000048] p-2 text-xs break-words text-white">
        {message.text}
      </div>
    </div>
  );
};
