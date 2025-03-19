import { ReactNode } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.verified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};
export default ProtectedRoute;
