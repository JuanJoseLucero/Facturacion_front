import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./KeycloakProvider";

export default function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Cargando sesión...</div>;
  if (!isAuthenticated) return <Navigate to="/no-autorizado" />;
  return <Outlet />;
}
