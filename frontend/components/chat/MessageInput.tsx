"use client";

import {
  useRef,
  useState,
  useEffect,
} from "react";

import {
  Smile,
  Paperclip,
  SendHorizontal,
} from "lucide-react";

import EmojiPicker from "emoji-picker-react";

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
  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  const currentUser = useUserStore(
    (state) => state.user
  );

  const typingTimeout =
    useRef<NodeJS.Timeout | null>(null);

  const pickerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(
          event.target as Node
        )
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  async function handleSend() {
    if (!conversationId) return;

    if (!text.trim()) return;

    try {
      await sendMessage(
        conversationId,
        text
      );

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
      clearTimeout(
        typingTimeout.current
      );
    }

    typingTimeout.current =
      setTimeout(() => {
        socket?.send(
          JSON.stringify({
            type: "stop_typing",
            conversation_id:
              conversationId,
            user_id: currentUser?.id,
          })
        );
      }, 1000);
  }

  return (
    <div className="relative bg-white dark:bg-[#202c33] border-t dark:border-[#2a3942] px-5 py-4 flex items-center gap-4">

      <div
        className="relative"
        ref={pickerRef}
      >
        <Smile
          size={22}
          className="cursor-pointer hover:text-yellow-500"
          onClick={() =>
            setShowEmojiPicker(
              (prev) => !prev
            )
          }
        />

        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0 z-50 shadow-xl">
            <EmojiPicker
              onEmojiClick={(
                emojiData
              ) => {
                setText(
                  (prev) =>
                    prev +
                    emojiData.emoji
                );

                setShowEmojiPicker(false);
              }}
              width={320}
              height={400}
            />
          </div>
        )}
      </div>

      <Paperclip
        size={22}
        className="cursor-pointer"
      />

      <input
        value={text}
        onChange={(e) =>
          handleTyping(
            e.target.value
          )
        }
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="
            flex-1
            rounded-full
            px-5
            py-3
            outline-none
            bg-gray-100
            dark:bg-[#2a3942]
            text-black
            dark:text-white
            placeholder:text-gray-500
            dark:placeholder:text-gray-400
          "
      />

      <button
        onClick={handleSend}
        className="bg-[#3A76F0] p-3 rounded-full text-white hover:bg-[#2f66d0]"
      >
        <SendHorizontal
          size={18}
        />
      </button>

    </div>
  );
}