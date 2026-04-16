import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import api from "../lib/axios";

export const useChats = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await api.get("/chats");
      return res.data;
    },
    enabled: !!token,
  });
};

export const useGetOrCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participantId) => {
      const res = await api.post(`/chats/with/${participantId}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chats"] }),
  });
};
