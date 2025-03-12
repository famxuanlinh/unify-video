'use client';

import usePeer from '@/hooks/use-peer';
import { SendIcon } from 'lucide-react';
import React from 'react';

import { ClearChatButton } from './clear-chat-button';

export const MessageInput = () => {
  const { send } = usePeer();

  return (
    <form className="flex gap-3 text-white" onSubmit={send}>
      <div className="relative flex-1">
        <input
          className="h-12 w-full rounded-full bg-[#00000052] px-4 pr-10 text-xs text-white placeholder-gray-300 focus:outline-hidden"
          type="text"
          placeholder="Send Message"
        />
        <button
          type="submit"
          className="absolute top-1/3 right-4 text-gray-300"
        >
          <SendIcon size={16} />
        </button>
      </div>

      <ClearChatButton />
    </form>
  );
};
