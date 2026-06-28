"use client";

import { useEffect, useRef } from "react";

import MessageBubble from "./MessageBubble";

import type { Message } from "@/types/message";
import { useUserStore } from "@/store/userStore";

interface Props {
  messages: Message[];
}

export default function MessageList({
  messages,
}: Props) {
  const currentUser = useUserStore(
    (state) => state.user
  );

  const bottomRef =
    useRef<HTMLDivElement>(null);

  // Auto-scroll whenever a new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        Select a conversation
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">

      {messages.map((msg, index) => (
        <MessageBubble
          key={
            msg.id ??
            `${msg.conversation_id}-${index}`
          }
          id={msg.id}
          text={msg.content}
          senderName={msg.sender_name}
          createdAt={msg.created_at}
          mine={
            msg.sender_id ===
            currentUser?.id
          }
          status={msg.status}
        />
      ))}

      <div ref={bottomRef} />

    </div>
  );
}