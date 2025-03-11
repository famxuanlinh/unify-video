import useMessagingStore from '@/store/messageProvider';
import { Trash2Icon } from 'lucide-react';
import React from 'react';

export const ClearChatButton = () => {
  const { clearMessages } = useMessagingStore();

  return (
    <button
      onClick={() => clearMessages()}
      type="button"
      className="w-12 h-12 rounded-full bg-[#00000052] flex items-center justify-center text-gray-200 font-medium"
    >
      <Trash2Icon size={16} />
    </button>
  );
};
