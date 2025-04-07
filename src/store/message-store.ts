import { create } from 'zustand';

export interface Message {
  id?: string;
  text: string;
  sender?: string;
  timestamp?: number;
  isMine?: boolean;
  isNewest?: boolean;
}

interface MessagingState {
  messages: Message[];
  isShowChat: boolean;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  changeStatusMessages: () => void;
  setIsShowChat: () => void;
}

export const useMessagingStore = create<MessagingState>(set => ({
  messages: [],
  isShowChat: false,

  addMessage: message =>
    set(state => ({ messages: [message, ...state.messages] })),
  clearMessages: () => set({ messages: [] }),
  setIsShowChat: () => set(state => ({ isShowChat: !state.isShowChat })),
  changeStatusMessages: () =>
    set(state => ({
      messages: state.messages.map(item =>
        item.isNewest ? { ...item, isNewest: false } : item
      )
    }))
}));
