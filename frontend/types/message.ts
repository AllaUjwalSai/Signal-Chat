export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_name?: string;
  content: string;
  status: "sent" | "delivered" | "read";
  created_at?: string;
}