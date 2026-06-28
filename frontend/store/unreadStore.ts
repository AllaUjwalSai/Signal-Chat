import { create } from "zustand";

interface UnreadStore {
  unread: Record<number, number>;

  increment: (conversationId: number) => void;

  clear: (conversationId: number) => void;
  reset: () => void;
}

export const useUnreadStore = create<UnreadStore>((set) => ({
  unread: {},

  increment: (conversationId) =>
    set((state) => ({
      unread: {
        ...state.unread,
        [conversationId]:
          (state.unread[conversationId] ?? 0) + 1,
      },
    })),

  clear: (conversationId) =>
    set((state) => ({
      unread: {
        ...state.unread,
        [conversationId]: 0,
      },
    })),
  reset: () =>
    set({
      unread: {},
    }),
}));