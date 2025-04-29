import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  adminRequired?: boolean;
}

function ProtectedRoute({
  children,
  adminRequired = false,
}: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminRequired && !user.email?.includes("admin")) {
    // Ejemplo sencillo, puedes luego mejorar con roles
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
