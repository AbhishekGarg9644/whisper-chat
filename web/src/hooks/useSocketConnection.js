import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketStore } from "../lib/socket";

export const useSocketConnection = (activeChatId) => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const { socket, connect, disconnect, joinChat, leaveChat } = useSocketStore();

  // connect socket when token is available
  useEffect(() => {
    if (token) {
      connect(token, queryClient);
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [token, connect, disconnect, queryClient]);

  // join/leave chat rooms - if you have a chatid in the url this will run
  useEffect(() => {
    if (activeChatId && socket) {
      joinChat(activeChatId);
      return () => leaveChat(activeChatId);
    }
  }, [activeChatId, socket, joinChat, leaveChat]);
};
