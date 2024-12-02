import { authService } from "@/config/auth";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  if (!authService.isAuthorized()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
