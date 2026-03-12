import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { ChatPage } from "./pages/ChatPage";

function AppInner() {
  const { username } = useAuth();
  const [loggedIn, setLoggedIn] = useState(false);

  if (!username || !loggedIn) {
    return <LoginPage onLoggedIn={() => setLoggedIn(true)} />;
  }

  return <ChatPage />;
}

export function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}