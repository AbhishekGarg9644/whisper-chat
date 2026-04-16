import axios from "axios";
import { useCallback } from "react";
import { MOBILE_API_URL } from "@/lib/config";
import { useAuthStore } from "@/store/useAuthStore";

const api = axios.create({
  baseURL: MOBILE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API request failed:", {
        endpoint: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status: error.response.status,
      });

      // Handle token expiration
      if (error.response.status === 401) {
        useAuthStore.getState().logout();
      }
    } else if (error.request) {
      console.warn("API request failed - no response", {
        endpoint: error.config?.url,
        method: error.config?.method?.toUpperCase(),
      });
    } else {
      console.error("API request setup failed:", error.message);
    }

    return Promise.reject(error);
  }
);

export const useApi = () => {
  const token = useAuthStore((state) => state.token);

  const apiWithAuth = useCallback(
    async <T>(config: Parameters<typeof api.request>[0]) => {
      return api.request<T>({
        ...config,
        headers: { ...config.headers, ...(token && { Authorization: `Bearer ${token}` }) },
      });
    },
    [token]
  );

  return { api, apiWithAuth };
};
