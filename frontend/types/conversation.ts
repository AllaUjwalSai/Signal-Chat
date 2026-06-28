export interface Conversation {
  id: number;
  user_id?: number;     // NEW

  display_name: string;
  avatar: string;
  last_message: string;

  is_group?: boolean;
  is_note?: boolean;
}