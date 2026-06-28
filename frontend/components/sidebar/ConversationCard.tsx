"use client";

import { CheckCheck } from "lucide-react";

import { useChatStore } from "@/store/chatStore";
import { useUnreadStore } from "@/store/unreadStore";
import { usePresenceStore } from "@/store/presenceStore";

type Props = {
  id: number;
  user_id?: number;

  name: string;
  avatar?: string;

  last: string;
  time: string;

  unread: number;

  isGroup?: boolean;
  typing?: boolean;
};

export default function ConversationCard({
  id,
  user_id,
  name,
  avatar,
  last,
  time,
  unread,
  isGroup,
  typing,
}: Props) {
  const setConversation = useChatStore(
    (state) => state.setSelectedConversation
  );

  const clearUnread = useUnreadStore(
    (state) => state.clear
  );

  const online = usePresenceStore(
    (state) =>
      user_id
        ? state.online[user_id]
        : false
  );

  return (
    <div
      onClick={() => {
        clearUnread(id);

        setConversation({
          id,
          user_id,
          display_name: name,
          avatar,
          last_message: last,
          is_group: isGroup,
        });
      }}
      className="flex items-center justify-between px-4 py-3 hover:bg-[#f4f4f4] cursor-pointer transition border-b dark:border-[#2a3942]"
    >
      <div className="flex items-center gap-3">

        <div className="relative">

          <img
            src={
              avatar && avatar.length > 0
                ? avatar
                : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                    name
                  )}`
            }
            className="w-12 h-12 rounded-full bg-gray-200"
            alt={name}
          />

          {online && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white dark:border-[#2a3942]" />
          )}

        </div>

        <div>

          <h2 className="font-semibold text-[15px]">
            {name}
          </h2>

          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">

            <CheckCheck
              size={14}
              className="text-blue-500"
            />

            <span
              className={
                typing
                  ? "text-green-600 italic"
                  : ""
              }
            >
              {typing
                ? "Typing..."
                : last}
            </span>

          </div>

        </div>
      </div>

      <div className="text-right">

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {time}
        </p>

        {unread > 0 && (
          <div className="mt-2 ml-auto bg-[#3A76F0] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {unread}
          </div>
        )}

      </div>
    </div>
  );
}