import { Message } from '@/store';
import { WholeWordIcon } from 'lucide-react';
import React from 'react';

export const MessageBubble = ({ message }: { message: Message }) => {
  return (
    <div
      className={`flex items-center gap-2 ${message.isMine ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className="bg-primary flex h-7 w-7 items-center justify-center rounded-full">
        <WholeWordIcon color="dodgerblue" size={18} />
      </div>

      <div className="max-w-[200px] rounded-md bg-[#00000048] p-2 text-xs break-words text-white">
        {message.text}
      </div>
    </div>
  );
};
