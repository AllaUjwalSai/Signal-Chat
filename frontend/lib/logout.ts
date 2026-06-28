import { disconnectSocket } from "./socket";

import { useUserStore } from "@/store/userStore";
import { useChatStore } from "@/store/chatStore";
import { useMessageStore } from "@/store/messageStore";
import { useTypingStore } from "@/store/typingStore";
import { useUnreadStore } from "@/store/unreadStore";
import { usePresenceStore } from "@/store/presenceStore";

export function logout() {
  // Remove JWT
  localStorage.removeItem("token");

  // Disconnect websocket
  disconnectSocket();

  // Reset all stores
  useUserStore.getState().reset();
  useChatStore.getState().reset();
  useMessageStore.getState().reset();
  useTypingStore.getState().reset();
  useUnreadStore.getState().reset();
  usePresenceStore.getState().reset();
}