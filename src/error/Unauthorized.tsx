import { LayoutDashboardContent } from "@/layout/LayoutDashboardContent";

export default function Unauthorized(): JSX.Element {
  return (
    <LayoutDashboardContent>
      <p className="text-3xl uppercase text-center">Unauthorized</p>
    </LayoutDashboardContent>
  );
}
