import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import { useAuthStore } from "./store/useAuthStore";
import api from "./lib/axios";

function App() {
  const isLoaded = useAuthStore((state) => state.isLoaded);
  const token = useAuthStore((state) => state.token);
  const restoreToken = useAuthStore((state) => state.restoreToken);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    restoreToken();
  }, [restoreToken]);

  useEffect(() => {
    if (token) {
      api
        .get("/auth/me")
        .then((res) => updateUser(res.data))
        .catch(() => logout());
    }
  }, [token, logout, updateUser]);

  if (!isLoaded) return <PageLoader />;

  return (
    <Routes>
      <Route path="/" element={!token ? <HomePage /> : <Navigate to={"/chat"} />} />
      <Route path="/chat" element={token ? <ChatPage /> : <Navigate to={"/"} />} />
    </Routes>
  );
}

export default App;
