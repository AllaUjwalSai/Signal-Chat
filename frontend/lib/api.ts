import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ??
    "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

// =========================
// Conversations
// =========================

export const getConversations = async () => {
  const res = await api.get("/chat/conversations");
  return res.data;
};

// =========================
// Current User
// =========================

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

// =========================
// Messages
// =========================

export const getMessages = async (
  conversationId: number
) => {
  const res = await api.get(
    `/message/${conversationId}`
  );

  return res.data;
};

export const sendMessage = async (
  conversation_id: number,
  content: string
) => {
  const res = await api.post("/message/send", {
    conversation_id,
    content,
  });

  return res.data;
};

export const deleteMessage = async (
  messageId: number
) => {
  const res = await api.delete(
    `/message/${messageId}`
  );

  return res.data;
};

// =========================
// Read Receipts
// =========================

export const markAsDelivered = async (
  messageId: number
) => {
  const res = await api.post(
    `/message/delivered/${messageId}`
  );

  return res.data;
};

export const markAsRead = async (
  messageId: number
) => {
  const res = await api.post("/message/read", {
    message_id: messageId,
  });

  return res.data;
};

// =========================
// Groups
// =========================

export const getGroupMembers = async (
  groupId: number
) => {
  const res = await api.get(
    `/chat/groups/${groupId}`
  );

  return res.data;
};

export const removeGroupMember = async (
  groupId: number,
  userId: number
) => {
  const res = await api.delete(
    `/chat/groups/${groupId}/members/${userId}`
  );

  return res.data;
};

export const addGroupMember = async (
  groupId: number,
  username: string
) => {
  const res = await api.post(
    `/chat/groups/${groupId}/members`,
    {
      username,
    }
  );

  return res.data;
};