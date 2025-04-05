import { useMessagingStore } from '@/store';
import { Trash2Icon } from 'lucide-react';
import React from 'react';

export const ClearChatButton = () => {
  const { clearMessages } = useMessagingStore();

  return (
    <button
      onClick={() => clearMessages()}
      type="button"
      className="flex size-10 items-center justify-center rounded-full bg-black/20 font-medium"
    >
      <Trash2Icon color="white" size={16} />
    </button>
  );
};
