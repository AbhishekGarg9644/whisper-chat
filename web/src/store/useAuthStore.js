import { create } from "zustand";
import api from "../lib/axios";

export const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("jwt_token") || null,
  user: null,
  isLoaded: false,

  login: async (token, user) => {
    localStorage.setItem("jwt_token", token);
    set({ token, user, isLoaded: true });
  },

  logout: async () => {
    localStorage.removeItem("jwt_token");
    set({ token: null, user: null, isLoaded: true });
  },

  restoreToken: async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        set({ token, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch (e) {
      console.error("Failed to restore token", e);
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
