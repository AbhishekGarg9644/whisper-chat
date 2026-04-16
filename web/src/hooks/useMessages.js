import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import api from "../lib/axios";

export const useMessages = (chatId) => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const res = await api.get(`/messages/chat/${chatId}`);
      return res.data;
    },
    enabled: !!chatId && !!token,
  });
};
