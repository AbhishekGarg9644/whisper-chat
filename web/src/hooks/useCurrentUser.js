import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";

export const useCurrentUser = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data;
    },
    enabled: !!token,
  });
};
