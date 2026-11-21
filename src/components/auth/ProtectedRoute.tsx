import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUsers } from "@/hooks/useUsers";
import type { UserRole } from "@/services/users";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, currentUser } = useUsers();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    const home = currentUser.role === "CLIENTE" ? "/portal" : "/dashboard";
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
