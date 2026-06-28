import { create } from "zustand";

export interface Conversation {
  id: number;
  display_name: string;
  avatar?: string;
  last_message?: string;
  is_group?: boolean;
  user_id?: number;
}

interface ChatStore {
  conversations: Conversation[];

  selectedConversation: Conversation | null;

  setConversations: (
    conversations: Conversation[]
  ) => void;

  updateConversation: (
    conversationId: number,
    updates: Partial<Conversation>
  ) => void;

  moveConversationToTop: (
    conversationId: number
  ) => void;

  setSelectedConversation: (
    conversation: Conversation
  ) => void;

  reset: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],

  selectedConversation: null,

  setConversations: (conversations) =>
    set({
      conversations,
    }),

  updateConversation: (conversationId, updates) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              ...updates,
            }
          : conversation
      ),
    })),

  moveConversationToTop: (conversationId) =>
    set((state) => {
      const conversation = state.conversations.find(
        (c) => c.id === conversationId
      );

      if (!conversation) {
        return {};
      }

      return {
        conversations: [
          conversation,
          ...state.conversations.filter(
            (c) => c.id !== conversationId
          ),
        ],
      };
    }),

  setSelectedConversation: (conversation) =>
    set({
      selectedConversation: conversation,
    }),

  reset: () =>
    set({
      conversations: [],
      selectedConversation: null,
    }),
}));