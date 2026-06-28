import { create } from "zustand";

interface TypingStore {
  typing: Record<number, boolean>;

  setTyping: (
    conversationId: number,
    value: boolean
  ) => void;
  reset: () => void;
}

export const useTypingStore = create<TypingStore>((set) => ({
  typing: {},

  setTyping: (conversationId, value) =>
    set((state) => ({
      typing: {
        ...state.typing,
        [conversationId]: value,
      },
    })),
  reset: () =>
    set({
      typing: {},
    }),
}));