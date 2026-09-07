import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import InvitePage from "./pages/InvitePage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-100 relative flex items-center justify-center p-0 md:p-4 overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.1),transparent_40%)]" />

      <div className="relative w-full h-[100dvh] md:h-auto flex items-center justify-center">
        <Routes>
          <Route path="/" element={authUser ? <ChatPage /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" replace />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" replace />} />
          <Route path="/invite/:id" element={authUser ? <InvitePage /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0b1120",
            color: "#f8fafc",
            border: "1px solid rgba(51, 65, 85, 0.7)",
            borderRadius: "16px",
            padding: "12px 16px",
            fontSize: "13px",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
          },
          success: {
            iconTheme: {
              primary: "#06b6d4",
              secondary: "#030712",
            },
          },
          error: {
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#030712",
            },
          },
        }}
      />
    </div>
  );
}

export default App;