import useMessagingStore from '@/store/message-provider';
import { Trash2Icon } from 'lucide-react';
import React from 'react';

export const ClearChatButton = () => {
  const { clearMessages } = useMessagingStore();

  return (
    <button
      onClick={() => clearMessages()}
      type="button"
      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00000052] font-medium text-gray-200"
    >
      <Trash2Icon size={16} />
    </button>
  );
};
