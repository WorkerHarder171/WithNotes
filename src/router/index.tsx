import { Routes, Route } from "react-router-dom";
import { LayoutDashboardRoot } from "@/layout/LayoutDashboardRoot";
import AccessPages from "@/pages/AccessPages";
import LandingPage from "@/pages/LandingPage";
import { PrivateRoute } from "./private-route";
import Unauthorized from "@/error/Unauthorized";
import NotFound from "@/error/NotFound";

export default function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<LayoutDashboardRoot />}>
        <Route index element={<LandingPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<AccessPages />} />
        </Route>
      </Route>
    </Routes>
  );
}
