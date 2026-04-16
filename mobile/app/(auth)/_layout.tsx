import { useAuthStore } from "@/store/useAuthStore";
import { Redirect, Stack } from "expo-router";

const AuthLayout = () => {
  const token = useAuthStore((state) => state.token);
  const isLoaded = useAuthStore((state) => state.isLoaded);

  if (!isLoaded) return null;

  if (token) return <Redirect href={"/(tabs)"} />;

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AuthLayout;
