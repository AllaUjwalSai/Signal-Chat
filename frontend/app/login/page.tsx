"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import api from "@/lib/api";
import { saveToken } from "@/lib/auth";

import { useUserStore } from "@/store/userStore";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const setUser = useUserStore(
    (state) => state.setUser
  );

  async function login() {
    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      saveToken(res.data.access_token);

      const me = await api.get("/auth/me");

      setUser(me.data);

      router.push("/");
    } catch {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white dark:bg-[#202c33] p-8 rounded-xl shadow w-96">

        <h1 className="text-2xl font-bold text-center mb-6">
          Signal Login
        </h1>

        <input
          className="border dark:border-[#2a3942] w-full p-3 rounded mb-4"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          className="border dark:border-[#2a3942] w-full p-3 rounded mb-6"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={login}
          className="bg-blue-600 hover:bg-blue-700 transition text-white w-full p-3 rounded"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}