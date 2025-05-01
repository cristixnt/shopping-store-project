import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  adminRequired?: boolean;
}

function ProtectedRoute({
  children,
  adminRequired = false,
}: ProtectedRouteProps) {
  const { user, role } = useAuthStore(); // Obtenemos el user y el role desde Zustand

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si se requiere un admin y el rol del usuario no es 'admin', redirigir a inicio
  if (adminRequired && role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
