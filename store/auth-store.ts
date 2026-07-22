import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser } from "@/types/auth.types";
import { tokenStorage } from "@/lib/token-storage";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (user: AuthUser, token: string, expiresInSeconds: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setSession: (user, token, expiresInSeconds) => {
        tokenStorage.set(token, expiresInSeconds);
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        tokenStorage.clear();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage", // key under which this is stored
      storage: createJSONStorage(() => localStorage),
      // Only persist these two fields — don't persist functions.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

