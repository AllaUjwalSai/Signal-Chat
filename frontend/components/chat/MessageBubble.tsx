"use client";

import { useState } from "react";

import {
  Check,
  CheckCheck,
  MoreVertical,
} from "lucide-react";

import { deleteMessage } from "@/lib/api";

type Props = {
  id: number;
  text: string;
  mine?: boolean;
  senderName?: string;
  createdAt?: string;
  status?: "sent" | "delivered" | "read";
};

export default function MessageBubble({
  id,
  text,
  mine,
  senderName,
  createdAt,
  status,
}: Props) {
  const [menuOpen, setMenuOpen] =
    useState(false);

  async function handleDelete() {
    try {
      await deleteMessage(id);

      setMenuOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete message.");
    }
  }

  return (
    <div
      className={`relative group max-w-md px-4 py-3 rounded-2xl shadow ${
        mine
          ? "bg-[#DCF8C6] self-end"
          : "bg-white self-start"
      }`}
    >
      {mine && (
        <>
          <button
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border z-50 overflow-hidden">
              <button
                onClick={handleDelete}
                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}

      {!mine && senderName && (
        <p className="text-[10px] text-gray-400 mb-1 font-medium">
          {senderName}
        </p>
      )}

      <p className="pr-6 break-words">
        {text}
      </p>

      <div className="flex justify-end items-center gap-1 mt-2 text-xs text-gray-500">

        <span>
          {createdAt
            ? (() => {
                const date = new Date(createdAt);

                date.setMinutes(date.getMinutes() + 330);

                return date.toLocaleTimeString(
                  "en-IN",
                  {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }
                );
              })()
            : ""}
        </span>

        {mine && (
          <>
            {status === "sent" && (
              <Check size={14} />
            )}

            {status === "delivered" && (
              <CheckCheck size={14} />
            )}

            {status === "read" && (
              <CheckCheck
                size={14}
                className="text-blue-500"
              />
            )}
          </>
        )}

      </div>
    </div>
  );
}