"use client";

import { useState, useRef, useEffect } from "react";

import {
  useTheme,
} from "@/components/providers/ThemeProvider";

import {
  Phone,
  Video,
  MoreVertical,
  LogOut,
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Smartphone,
  ChevronDown,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
  getGroupMembers,
  removeGroupMember,  
  addGroupMember,
} from "@/lib/api";

import { logout } from "@/lib/logout";

import { useChatStore } from "@/store/chatStore";
import { usePresenceStore } from "@/store/presenceStore";

interface Props {
  typing: boolean;
}

interface GroupMember {
  user_id: number;
  display_name: string;
  username: string;
  avatar: string;
}

export default function ChatHeader({
  typing,
}: Props) {
  const router = useRouter();

  const conversation = useChatStore(
    (state) => state.selectedConversation
  );

  const online = usePresenceStore(
    (state) =>
      conversation?.user_id
        ? state.online[conversation.user_id]
        : false
  );

  const {
  theme,
  toggleTheme,
} = useTheme();

  const [open, setOpen] = useState(false);

  const [membersOpen, setMembersOpen] =
    useState(false);

  const [members, setMembers] = useState<
    GroupMember[]
  >([]);

  const menuRef = useRef<HTMLDivElement>(null);

  const membersRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          e.target as Node
        )
      ) {
        setOpen(false);
      }

      if (
        membersRef.current &&
        !membersRef.current.contains(
          e.target as Node
        )
      ) {
        setMembersOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  async function loadMembers() {
    if (!conversation) return;

    try {
      const data =
        await getGroupMembers(
          conversation.id
        );

      setMembers(data);

      setMembersOpen(true);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRemoveMember(
    userId: number
  ) {
    if (!conversation) return;

    if (
      !confirm(
        "Remove this member from the group?"
      )
    ) {
      return;
    }

    try {
      await removeGroupMember(
        conversation.id,
        userId
      );

      window.location.reload();
    } catch (err) {
      console.error(err);

      alert("Failed to remove member.");
    }
  }

  async function handleAddMember() {
    if (!conversation) return;

    const username = prompt("Enter Username");

    if (!username) return;

    try {
      await addGroupMember(
        conversation.id,
        username
      );

      window.location.reload();
    } catch (err) {
      console.error(err);

      alert("Failed to add member.");
    }
  }

  function handleLogout() {
    logout();

    router.replace("/login");
  }

  return (
  <header className="h-20 bg-white dark:bg-[#202c33] border-b dark:border-[#2a3942] flex items-center justify-between px-6">

    <div className="flex items-center gap-3">

      <div className="relative">

        <img
          src={`https://api.dicebear.com/9.x/initials/svg?seed=${
            conversation?.display_name ||
            "Signal"
          }`}
          className="w-12 h-12 rounded-full"
          alt="Avatar"
        />

        {!conversation?.is_group &&
          conversation?.user_id &&
          online && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border dark:border-[#2a3942] border-white" />
          )}

      </div>

      <div className="relative" ref={membersRef}>

        {conversation?.is_group ? (

          <button
            onClick={() => {
              if (membersOpen) {
                setMembersOpen(false);
              } else {
                loadMembers();
              }
            }}
            className="flex items-center gap-1 font-semibold text-lg hover:text-[#3A76F0]"
          >
            {conversation.display_name}

            <ChevronDown size={16} />
          </button>

        ) : (

          <h2 className="font-semibold text-lg">
            {conversation?.display_name ??
              "Select a conversation"}
          </h2>

        )}

        <p
          className={`text-sm ${
            typing
              ? "text-green-600"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {!conversation
            ? ""
            : typing
            ? "Typing..."
            : conversation.is_group
            ? "Group"
            : online
            ? "Online"
            : "Offline"}
        </p>

        {membersOpen && (

          <div className="absolute top-14 left-0 w-72 bg-white dark:bg-[#202c33] rounded-xl border dark:border-[#2a3942] shadow-xl z-50 overflow-hidden">

            <div className="px-4 py-3 font-semibold border-b dark:border-[#2a3942]">
              Group Members
            </div>

            {members.length === 0 && (

              <div className="p-4 text-gray-500 dark:text-gray-400">
                No members
              </div>

            )}

            {members.map((member) => (
  <div
    key={member.user_id}
    className="flex items-center justify-between px-4 py-3 border-b dark:border-[#2a3942] hover:bg-gray-50 dark:hover:bg-[#2a3942]"
  >
    <div className="flex items-center gap-3">
      <img
        src={
          member.avatar && member.avatar.length > 0
            ? member.avatar
            : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                member.display_name
              )}`
        }
        className="w-8 h-8 rounded-full"
        alt={member.display_name}
      />

      <div>
        <p className="font-medium">
          {member.display_name}
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          @{member.username}
        </p>
      </div>
    </div>

    <button
      onClick={() =>
        handleRemoveMember(member.user_id)
      }
      className="text-red-600 text-sm hover:underline"
    >
      Remove
    </button>
  </div>
))}

<div className="p-3 border-t dark:border-[#2a3942]">
  <button
    onClick={handleAddMember}
    className="w-full bg-[#3A76F0] text-white py-2 rounded-lg hover:bg-[#2f66d0]"
  >
    + Add Member
  </button>
</div>

          </div>

        )}

      </div>

    </div>

    <div className="relative flex items-center gap-5">

      <Phone
        size={20}
        className="cursor-pointer hover:text-[#3A76F0]"
      />

      <Video
        size={20}
        className="cursor-pointer hover:text-[#3A76F0]"
      />

      <MoreVertical
        size={20}
        className="cursor-pointer hover:text-[#3A76F0]"
        onClick={() => setOpen(!open)}
      />

      {open && (

        <div
          ref={menuRef}
          className="absolute top-10 right-0 w-72 bg-white dark:bg-[#202c33] rounded-xl shadow-xl border dark:border-[#2a3942] z-50 overflow-hidden"
        >
                    <button className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#2a3942] transition">
            <div className="flex items-center gap-3">
              <User size={18} />
              Profile
            </div>

            <span className="text-xs text-gray-400">
              Coming Soon
            </span>
          </button>

          <button className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#2a3942] transition">
            <div className="flex items-center gap-3">
              <Settings size={18} />
              Settings
            </div>

            <span className="text-xs text-gray-400">
              Coming Soon
            </span>
          </button>

          <button className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#2a3942] transition">
            <div className="flex items-center gap-3">
              <Shield size={18} />
              Privacy
            </div>

            <span className="text-xs text-gray-400">
              Coming Soon
            </span>
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#2a3942] transition"
          >
            <div className="flex items-center gap-3">
              <Palette size={18} />
              Appearance
            </div>

            <span className="text-xs text-gray-400">
              {theme === "dark"
                ? "Dark"
                : "Light"}
            </span>
          </button>

          <button className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#2a3942] transition">
            <div className="flex items-center gap-3">
              <Smartphone size={18} />
              Linked Devices
            </div>

            <span className="text-xs text-gray-400">
              Coming Soon
            </span>
          </button>

          <hr />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      )}

    </div>

  </header>
);
}