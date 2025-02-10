import { create } from "zustand";

type ProfileStore = {
  userId?: number;
  statusMessage: string;
  setStatusMessage: (message: string) => void;
};

export const useProfileStore = create<ProfileStore>()((set) => ({
  userId: undefined,
  statusMessage: "",
  setStatusMessage: (message) => set({ statusMessage: message }),
}));

export const useUserId = () => useProfileStore((state) => state.userId);
