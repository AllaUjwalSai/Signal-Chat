"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";

import { getToken } from "@/lib/auth";
import { getCurrentUser } from "@/lib/api";
import { useUserStore } from "@/store/userStore";

export default function Home() {
  const router = useRouter();

  const setUser = useUserStore(
    (state) => state.setUser
  );

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    async function loadUser() {
      try {
        const user = await getCurrentUser();
        setUser(user);
      } catch {
        router.replace("/login");
      }
    }

    loadUser();
  }, [router, setUser]);

  return <MainLayout />;
}