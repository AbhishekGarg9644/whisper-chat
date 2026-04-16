import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { useApi } from "@/lib/axios";

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoaded: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isLoaded: false,

  login: async (token: string, user: User) => {
    await SecureStore.setItemAsync("jwt_token", token);
    set({ token, user, isLoaded: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("jwt_token");
    set({ token: null, user: null, isLoaded: true });
  },

  restoreToken: async () => {
    console.log("[AuthStore] Starting restoreToken...");
    try {
      console.log("[AuthStore] Accessing SecureStore...");
      const token = await SecureStore.getItemAsync("jwt_token");
      console.log("[AuthStore] SecureStore finished. Token found:", !!token);
      
      if (token) {
        set({ token, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch (e) {
      console.error("[AuthStore] CRITICAL ERROR in restoreToken:", e);
      set({ isLoaded: true });
    }
  },

  updateUser: (updatedUser) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...updatedUser } });
    }
  },
}));
