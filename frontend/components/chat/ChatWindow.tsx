"use client";

import { useEffect, useCallback } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

import {
  getMessages,
  markAsDelivered,
  markAsRead,
} from "@/lib/api";

import { subscribe } from "@/lib/messageEvents";

import { useChatStore } from "@/store/chatStore";
import { useTypingStore } from "@/store/typingStore";
import { useUserStore } from "@/store/userStore";
import { useMessageStore } from "@/store/messageStore";

import type { Message } from "@/types/message";

export default function ChatWindow() {
  const conversation = useChatStore(
    (state) => state.selectedConversation
  );

  const currentUser = useUserStore(
    (state) => state.user
  );

  const typing = useTypingStore(
    (state) => state.typing
  );

  const messagesByConversation = useMessageStore(
    (state) => state.messages
  );

  const messages =
    conversation
      ? messagesByConversation[conversation.id] ?? []
      : [];

  const setMessages = useMessageStore(
    (state) => state.setMessages
  );

  const addMessage = useMessageStore(
    (state) => state.addMessage
  );

  const loadMessages = useCallback(async () => {
    if (!conversation) return;

    try {
      const data = await getMessages(conversation.id);

      setMessages(
        conversation.id,
        data
      );

      for (const message of data) {
        if (message.sender_id === currentUser?.id) {
          continue;
        }

        if (message.status === "sent") {
          await markAsDelivered(message.id);
        }

        if (message.status !== "read") {
          await markAsRead(message.id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [
    conversation,
    currentUser,
    setMessages,
  ]);

  // Initial load
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Listen for new realtime messages
  useEffect(() => {
    const unsubscribe = subscribe(
      (message: Message) => {
        if (
          conversation &&
          message.conversation_id === conversation.id
        ) {
          addMessage(
            conversation.id,
            message
          );
        }
      }
    );

    return unsubscribe;
  }, [
    conversation,
    addMessage,
  ]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#efeae2]">
        <p className="text-gray-500 text-lg">
          Select a conversation
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#efeae2]">

      <ChatHeader
        typing={typing[conversation.id] ?? false}
      />

      <MessageList
        messages={messages}
      />

      <MessageInput
        conversationId={conversation.id}
      />

    </div>
  );
}