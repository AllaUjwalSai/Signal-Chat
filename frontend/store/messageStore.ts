import { create } from "zustand";

import type { Message } from "@/types/message";

interface MessageStore {
  messages: Record<number, Message[]>;

  setMessages: (
    conversationId: number,
    messages: Message[]
  ) => void;

  addMessage: (
    conversationId: number,
    message: Message
  ) => void;

  updateStatus: (
    messageId: number,
    status: "sent" | "delivered" | "read"
  ) => void;

  deleteMessage: (
      messageId: number
  ) => void;

  reset: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: {},

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    })),

  addMessage: (conversationId, message) =>
    set((state) => {
      const existing =
        state.messages[conversationId] ?? [];

      // Don't add duplicates
      if (
        existing.some(
          (m) =>
            m.id === message.id &&
            message.id != null
        )
      ) {
        return state;
      }

      return {
        messages: {
          ...state.messages,
          [conversationId]: [
            ...existing,
            message,
          ],
        },
      };
    }),

  updateStatus: (messageId, status) =>
    set((state) => {
      const updated = { ...state.messages };

      Object.keys(updated).forEach((id) => {
        updated[Number(id)] =
          updated[Number(id)].map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  status,
                }
              : msg
          );
      });

      return {
        messages: updated,
      };
    }),
  deleteMessage: (messageId) =>
    set((state) => {
      const updated = { ...state.messages };

      Object.keys(updated).forEach((id) => {
        updated[Number(id)] = updated[Number(id)].filter((msg) => msg.id !== messageId);
      });

      return {
        messages: updated,
      };
    }),
  reset: () =>
    set({
      messages: {},
    }),
}));