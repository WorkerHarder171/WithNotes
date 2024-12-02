import { LayoutDashboardContent } from "@/layout/LayoutDashboardContent";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import Notes from "@/components/section/Notes";

export default function AccessPages() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 1000);
  }, []);
  return (
    <LayoutDashboardContent>
      {isLoading ? (
        <Notes />
      ) : (
        <div className=" h-[600px] flex justify-center
        items-center">
          <CircularProgress size={60}/>
        </div>
      )}
    </LayoutDashboardContent>
  );
}
