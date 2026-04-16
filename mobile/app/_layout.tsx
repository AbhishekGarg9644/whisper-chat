import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import SocketConnection from "@/components/SocketConnection";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { useApi } from "@/lib/axios";
import "../global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  const isLoaded = useAuthStore((state) => state.isLoaded);
  const token = useAuthStore((state) => state.token);
  const restoreToken = useAuthStore((state) => state.restoreToken);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);
  const { api } = useApi();

  // ✅ This runs immediately on first mount — BEFORE the isLoaded check
  useEffect(() => {
    console.log("[RootLayout] Triggering restoreToken...");
    restoreToken();
  }, []);

  // ✅ Once token is available, fetch the user profile from the server
  useEffect(() => {
    console.log("[RootLayout] Token state changed:", token ? "Token present" : "No token");
    if (token) {
      console.log("[RootLayout] Fetching user profile...");
      api
        .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          console.log("[RootLayout] User profile fetched successfully");
          updateUser(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch user during bootstrap:", err.message);
          logout();
        });
    }
  }, [token]);

  // Wait for SecureStore to finish reading — shows nothing (splash stays visible)
  if (!isLoaded) {
    console.log("[RootLayout] Waiting for isLoaded...");
    return null;
  }
  
  console.log("[RootLayout] AUTH LOADED. Rendering Provider tree.");

  return (
    <QueryClientProvider client={queryClient}>
      <SocketConnection />
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0D0D0F" } }}>
        <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
        <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
        <Stack.Screen
          name="new-chat"
          options={{
            animation: "slide_from_bottom",
            presentation: "modal",
            gestureEnabled: true,
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
