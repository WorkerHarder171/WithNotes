import React from "react";
import { Navigate } from "react-router-dom";
import { AuthService } from "@/services/AuthService";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authService = new AuthService();
  const isAuthorized = authService.isAuthorized();

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
