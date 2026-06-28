"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ConversationCard from "./ConversationCard";

import { getConversations } from "@/lib/api";

import { useChatStore } from "@/store/chatStore";
import { useTypingStore } from "@/store/typingStore";
import { useUnreadStore } from "@/store/unreadStore";

export default function Sidebar() {
  const [search, setSearch] = useState("");

  const chats = useChatStore(
    (state) => state.conversations
  );

  const selectedConversation = useChatStore(
    (state) => state.selectedConversation
  );

  const setConversations = useChatStore(
    (state) => state.setConversations
  );

  const setSelectedConversation = useChatStore(
    (state) => state.setSelectedConversation
  );

  const typing = useTypingStore(
    (state) => state.typing
  );

  const unread = useUnreadStore(
    (state) => state.unread
  );

  const clearUnread = useUnreadStore(
    (state) => state.clear
  );

  useEffect(() => {
    async function loadChats() {
      try {
        const data = await getConversations();

        setConversations(data);

        if (
          !selectedConversation &&
          data.length > 0
        ) {
          setSelectedConversation({
            id: data[0].id,
            user_id: data[0].user_id,
            display_name: data[0].display_name,
            avatar: data[0].avatar,
            last_message: data[0].last_message,
            is_group: data[0].is_group,
          });

          clearUnread(data[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadChats();
  }, [
    selectedConversation,
    setConversations,
    setSelectedConversation,
    clearUnread,
  ]);

  const filteredChats = chats.filter((chat) =>
    chat.display_name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <aside className="w-[370px] bg-white border-r flex flex-col">

      {/* Header */}

      <div className="flex items-center justify-between p-5">

        <h1 className="text-3xl font-bold text-[#3A76F0]">
          Signal
        </h1>

        <button className="rounded-full p-2 hover:bg-gray-100">
          ✏️
        </button>

      </div>

      {/* Buttons */}

      <div className="px-4 pb-3">

        <Link
          href="/contacts"
          className="block w-full bg-[#3A76F0] text-white text-center py-3 rounded-xl hover:bg-[#2f66d0]"
        >
          + New Chat
        </Link>

        <Link
          href="/groups"
          className="block w-full mt-2 bg-green-600 text-white text-center py-3 rounded-xl hover:bg-green-700"
        >
          + New Group
        </Link>

      </div>

      {/* Search */}

      <div className="px-4 pb-4">

        <input
          placeholder="Search conversations..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-xl bg-gray-100 px-4 py-3 outline-none"
        />

      </div>

      {/* Conversations */}

      <div className="flex-1 overflow-y-auto">

        {filteredChats.length === 0 ? (

          <div className="text-center text-gray-500 mt-10">
            No conversations found
          </div>

        ) : (

          filteredChats.map((chat) => (

            <ConversationCard
              key={chat.id}
              id={chat.id}
              user_id={chat.user_id}
              name={chat.display_name}
              avatar={chat.avatar}
              last={chat.last_message || "No messages yet"}
              time=""
              unread={unread[chat.id] ?? 0}
              typing={typing[chat.id] ?? false}
              isGroup={chat.is_group}
            />

          ))

        )}

      </div>

    </aside>
  );
}