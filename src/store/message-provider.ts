import { create } from 'zustand';

export interface Message {
  id?: string;
  text: string;
  sender?: string;
  timestamp?: number;
  isMine?: boolean;
}

interface MessagingState {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

const useMessagingStore = create<MessagingState>(set => ({
  messages: [],

  addMessage: message =>
    set(state => ({ messages: [message, ...state.messages] })),

  clearMessages: () => set({ messages: [] })
}));

export default useMessagingStore;
