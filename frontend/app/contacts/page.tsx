"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import api from "@/lib/api";
import type { User } from "@/types/user";

import { useUserStore } from "@/store/userStore";

export default function ContactsPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const currentUser = useUserStore(
    (state) => state.user
  );

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadUsers();
  }, []);

  async function createNotes() {
    try {
      await api.post("/chat/notes");

      router.push("/");
    } catch (err) {
      console.error(err);
    }
  }

  async function startChat(userId: number) {
    try {
      await api.post("/chat/conversations", {
        user2_id: userId,
      });

      router.push("/");
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = users
    .filter((u) => u.id !== currentUser?.id)
    .filter((u) =>
      u.display_name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white border-b shadow-sm">

        <div className="max-w-3xl mx-auto flex items-center gap-3 p-4">

          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-2xl font-bold">
            New Chat
          </h1>

        </div>

      </div>

      <div className="max-w-3xl mx-auto p-8">

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full p-3 rounded-xl border mb-6"
        />

        <div
          onClick={createNotes}
          className="bg-yellow-50 rounded-xl p-5 flex justify-between items-center shadow cursor-pointer mb-5 hover:bg-yellow-100 transition"
        >
          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-2xl">
              📝
            </div>

            <div>

              <h2 className="font-semibold">
                Note to Self
              </h2>

              <p className="text-gray-500">
                Save messages for yourself
              </p>

            </div>

          </div>
        </div>

        <div className="space-y-3">

          {filtered.map((user) => (

            <div
              key={user.id}
              className="bg-white rounded-xl p-5 flex justify-between items-center shadow"
            >

              <div className="flex items-center gap-4">

                <img
                  src={
                    user.avatar && user.avatar.length > 0
                      ? user.avatar
                      : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                          user.display_name
                        )}`
                  }
                  className="w-12 h-12 rounded-full"
                  alt={user.display_name}
                />

                <div>

                  <h2 className="font-semibold">
                    {user.display_name}
                  </h2>

                  <p className="text-gray-500">
                    @{user.username}
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  startChat(user.id)
                }
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Start Chat
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}