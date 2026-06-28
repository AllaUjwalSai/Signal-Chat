import { create } from "zustand";

interface User {
  id: number;
  username: string;
  display_name: string;
  phone: string;
  avatar?: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  reset: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (user) =>
    set({
      user,
    }),
  reset: () =>
    set({
      user: null,
    }),
}));