import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import api from "../lib/axios";

export const useUsers = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data;
    },
    enabled: !!token,
  });
};
