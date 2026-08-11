import { create } from "zustand";
import { profileService } from "@/services/profile.service";
import type { UserProfile } from "@/types/profile.types";

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  isError: boolean;
  hasFetched: boolean;
  setProfile: (profile: UserProfile | null) => void;
  fetchProfile: () => Promise<void>;
  refetchProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  isError: false,
  hasFetched: false,

  setProfile: (profile) => set({ profile, hasFetched: true }),

  fetchProfile: async () => {
    if (get().hasFetched || get().isLoading) return;

    set({ isLoading: true, isError: false });
    try {
      const response = await profileService.getProfile();
      set({ profile: response.data, isLoading: false, hasFetched: true });
    } catch {
      set({ isLoading: false, isError: true, hasFetched: false });
    }
  },

  refetchProfile: async () => {
    set({ isLoading: true, isError: false });
    try {
      const response = await profileService.getProfile();
      set({ profile: response.data, isLoading: false, hasFetched: true });
    } catch {
      set({ isLoading: false, isError: true });
    }
  },
}));
