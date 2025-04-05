'use client';

import { ClearChatButton } from '@/app/(auth)/_components';
import { usePeer } from '@/hooks';
import { useMessagingStore } from '@/store';
import { SendIcon } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

export const MessageInput = () => {
  const { send } = usePeer();
  const { isShowChat } = useMessagingStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements[0] as HTMLInputElement;
    if (!input.value) return;
    send({ text: input.value });
    input.value = '';
  };

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isShowChat) {
      ref.current?.focus();
    }
  }, [isShowChat]);

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <div className="relative flex-1">
        <input
          className="text-body-m h-10 w-full rounded-full bg-black/20 pr-4 pl-3 text-white placeholder-gray-300 focus:outline-hidden"
          type="text"
          ref={ref}
          placeholder="Send Message"
        />
        <button
          type="submit"
          className="absolute top-2.5 right-4 text-gray-300"
        >
          <SendIcon color="white" size={20} />
        </button>
      </div>

      <ClearChatButton />
    </form>
  );
};
