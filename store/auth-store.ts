import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser } from "@/types/auth.types";
import { tokenStorage } from "@/lib/token-storage";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (user: AuthUser, token: string, expiresInSeconds: number) => void;
  logout: () => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
      
      clearSession: () => get().logout(),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);