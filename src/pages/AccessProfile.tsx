import { LayoutDashboardContent } from "../layout/LayoutDashboardContent";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import Profile from "@/components/section/Profile";

export default function AccessProfile(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 1000);
  }, []);

  return (
    <LayoutDashboardContent>
      {isLoading ? (
        <Profile />
      ) : (
        <div
          className=" h-[600px] flex justify-center
  items-center"
        >
          <CircularProgress size={60} />
        </div>
      )}
    </LayoutDashboardContent>
  );
}
