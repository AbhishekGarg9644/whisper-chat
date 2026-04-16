import { useSocketStore } from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const SocketConnection = () => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);

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

  return null;
};

export default SocketConnection;
