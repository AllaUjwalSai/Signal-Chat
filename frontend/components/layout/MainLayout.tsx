"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function MainLayout() {
  return (
    <main className="h-screen w-screen bg-[#f5f5f5] flex">

      <Sidebar />

      <ChatWindow />

    </main>
  );
}