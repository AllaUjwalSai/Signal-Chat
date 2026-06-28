"use client";

import { useEffect } from "react";

import { connectSocket } from "@/lib/socket";
import { publish } from "@/lib/messageEvents";

import { useChatStore } from "@/store/chatStore";
import { useTypingStore } from "@/store/typingStore";
import { useUnreadStore } from "@/store/unreadStore";
import { useMessageStore } from "@/store/messageStore";
import { useUserStore } from "@/store/userStore";
import { usePresenceStore } from "@/store/presenceStore";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = useUserStore(
    (state) => state.user
  );

  const selectedConversation = useChatStore(
    (state) => state.selectedConversation
  );

  const updateConversation = useChatStore(
    (state) => state.updateConversation
  );

  const moveConversationToTop = useChatStore(
    (state) => state.moveConversationToTop
  );

  const incrementUnread = useUnreadStore(
    (state) => state.increment
  );

  const setTyping = useTypingStore(
    (state) => state.setTyping
  );

  const updateStatus = useMessageStore(
    (state) => state.updateStatus
  );

  const setOnline = usePresenceStore(
    (state) => state.setOnline
  );

  const deleteMessage =
    useMessageStore(
        state => state.deleteMessage
    );

  useEffect(() => {
    if (!currentUser) return;

    const socket = connectSocket(
      currentUser.id
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "message": {
          const message = data.payload;

          updateConversation(
            message.conversation_id,
            {
              last_message: message.content,
            }
          );

          moveConversationToTop(
            message.conversation_id
          );

          publish(message);

          if (
            !selectedConversation ||
            selectedConversation.id !==
              message.conversation_id
          ) {
            incrementUnread(
              message.conversation_id
            );
          }

          break;
        }

        case "typing":
          setTyping(
            data.conversation_id,
            true
          );
          break;

        case "stop_typing":
          setTyping(
            data.conversation_id,
            false
          );
          break;

        case "delivered":
          updateStatus(
            data.payload.message_id,
            "delivered"
          );
          break;

        case "read":
          console.log("👀 READ EVENT", data);

          updateStatus(
            data.payload.message_id,
            "read"
          );
          break;

        case "presence":
          setOnline(
            data.user_id,
            data.online
          );
          break;

        case "message_deleted":
          deleteMessage(data.payload.message_id);
          break;

        default:
          break;
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [
    currentUser,
    selectedConversation,
    updateConversation,
    moveConversationToTop,
    incrementUnread,
    setTyping,
    updateStatus,
    setOnline,
    deleteMessage,
  ]);

  return <>{children}</>;
}   