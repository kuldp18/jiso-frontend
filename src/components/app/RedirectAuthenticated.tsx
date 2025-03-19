import { useAuthStore } from "@/stores/authStore";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

const RedirectAuthenticated = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RedirectAuthenticated;
