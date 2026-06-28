import { create } from "zustand";

interface PresenceStore {
  online: Record<number, boolean>;

  setOnline: (
    userId: number,
    value: boolean
  ) => void;

  reset: () => void;
}

export const usePresenceStore =
  create<PresenceStore>((set) => ({
    online: {},

    setOnline: (userId, value) =>
      set((state) => ({
        online: {
          ...state.online,
          [userId]: value,
        },
      })),
    reset: () =>
      set({
        online: {},
      }),
  }));