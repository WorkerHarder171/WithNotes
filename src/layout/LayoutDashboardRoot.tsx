import { Outlet } from "react-router-dom";
import Navbar from "@/components/navigation/Navbar";

export function LayoutDashboardRoot() {
  return (
    <div className="wrapper py-10 bg-[#E2E6E9] h-screen">
      <Navbar />
      <div className="body my-10">
        <Outlet />
      </div>
    </div>
  );
}
