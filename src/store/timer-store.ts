import { create } from 'zustand';

type TimerStore = {
  timerRef: NodeJS.Timeout | null;
  startTimer: (callback: () => void) => void;
  stopTimer: () => void;
};

export const useTimerStore = create<TimerStore>(set => ({
  timerRef: null,
  startTimer: callback => {
    set(state => {
      if (state.timerRef) {
        clearInterval(state.timerRef);
      }
      const newTimer = setInterval(callback, 1000);

      return { timerRef: newTimer };
    });
  },
  stopTimer: () => {
    set(state => {
      if (state.timerRef) {
        clearInterval(state.timerRef);
      }

      return { timerRef: null };
    });
  }
}));
