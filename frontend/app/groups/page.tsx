"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import api from "@/lib/api";

interface User {
  id: number;
  display_name: string;
  username: string;
}

export default function GroupsPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [groupName, setGroupName] = useState("");

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

  function toggle(id: number) {
    if (selected.includes(id)) {
      setSelected(
        selected.filter((x) => x !== id)
      );
    } else {
      setSelected([
        ...selected,
        id,
      ]);
    }
  }

  async function createGroup() {
    try {
      await api.post("/chat/groups", {
        name: groupName,
        members: selected,
      });

      router.push("/");
    } catch (err: any) {
      alert(
        err.response?.data?.detail ??
          "Failed to create group."
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white dark:bg-[#202c33] border-b dark:border-[#2a3942] shadow-sm">

        <div className="max-w-3xl mx-auto flex items-center gap-3 p-4">

          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942] transition"
          >
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-2xl font-bold">
            Create Group
          </h1>

        </div>

      </div>

      <div className="max-w-3xl mx-auto py-8">

        <input
          value={groupName}
          onChange={(e) =>
            setGroupName(e.target.value)
          }
          placeholder="Group Name"
          className="w-full p-3 rounded-xl border dark:border-[#2a3942] mb-8"
        />

        <div className="bg-white dark:bg-[#202c33] rounded-xl shadow">

          {users.map((user) => (

            <label
              key={user.id}
              className="flex items-center justify-between p-4 border-b hover:bg-gray-50 cursor-pointer"
            >

              <div className="flex items-center gap-4">

                <img
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                    user.display_name
                  )}`}
                  className="w-10 h-10 rounded-full"
                  alt={user.display_name}
                />

                <div>

                  <p className="font-semibold">
                    {user.display_name}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{user.username}
                  </p>

                </div>

              </div>

              <input
                type="checkbox"
                checked={selected.includes(
                  user.id
                )}
                onChange={() =>
                  toggle(user.id)
                }
              />

            </label>

          ))}

        </div>

        <button
          onClick={createGroup}
          className="mt-8 w-full bg-[#3A76F0] hover:bg-[#295fd4] text-white py-3 rounded-xl font-semibold"
        >
          Create Group
        </button>

      </div>

    </div>
  );
}