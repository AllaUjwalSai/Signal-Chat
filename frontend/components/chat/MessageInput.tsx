"use client";

import { useRef, useState } from "react";
import { Smile, Paperclip, SendHorizontal } from "lucide-react";

import { sendMessage } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { useUserStore } from "@/store/userStore";

interface Props {
  conversationId: number | null;
}

export default function MessageInput({
  conversationId,
}: Props) {
  const [text, setText] = useState("");

  const currentUser = useUserStore(
    (state) => state.user
  );

  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  async function handleSend() {
    if (!conversationId) return;

    if (!text.trim()) return;

    try {
      await sendMessage(conversationId, text);

      setText("");

      const socket = getSocket();

      socket?.send(
        JSON.stringify({
          type: "stop_typing",
          conversation_id: conversationId,
          user_id: currentUser?.id,
        })
      );
    } catch (err) {
      console.error(err);
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTyping(value: string) {
    setText(value);

    if (!conversationId) return;

    const socket = getSocket();

    socket?.send(
      JSON.stringify({
        type: "typing",
        conversation_id: conversationId,
        user_id: currentUser?.id,
      })
    );

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket?.send(
        JSON.stringify({
          type: "stop_typing",
          conversation_id: conversationId,
          user_id: currentUser?.id,
        })
      );
    }, 1000);
  }

  return (
    <div className="bg-white border-t px-5 py-4 flex items-center gap-4">

      <Smile size={22} />

      <Paperclip size={22} />

      <input
        value={text}
        onChange={(e) => handleTyping(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 bg-gray-100 rounded-full px-5 py-3 outline-none"
      />

      <button
        onClick={handleSend}
        className="bg-[#3A76F0] p-3 rounded-full text-white"
      >
        <SendHorizontal size={18} />
      </button>

    </div>
  );
}