import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { supabase } from "@/config/supabase/supabaseClient";

interface CardEditProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  desc: string;
  time?: string;
  date?: Date;
  className?: string;
  editDataNotes?: { title: string; desc: string };
}

export default function CardEdit({
  editDataNotes,
  title,
  desc,
  className,
  ...props
}: CardEditProps) {
  const [textNotes, setTextNotes] = useState<{ title: string; desc: string }>({
    title: "",
    desc: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const id = useId();
  const categoryHeight = useRef<HTMLDivElement>(null);
  const titleWidth = useRef<HTMLDivElement>(null);

  const fetchDataNotes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({ title: textNotes.title, desc: textNotes.desc })
        .eq("id", id);

      if (error) throw new Error(`Error updating note: ${error.message}`);

      if (data) {
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  function handleEdit(): void {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", textNotes.title);
    formData.append("desc", textNotes.desc);

    fetchDataNotes();
  }

  useEffect(() => {
    if (editDataNotes) {
      setTextNotes({ ...editDataNotes });
    }
  }, [editDataNotes]);

  return (
    <div
      className={`${className} p-5 rounded-[20px] bg-[#fff] h-[400px] relative flex flex-col relative`}
      id={`card-${id}`}
      {...props}
    >
      <div className="card-header flex justify-between items-center border-b py-5 border-[#ddd]">
        <p className="text-3xl font-semibold capitalize">{title}</p>
        <button className="px-5 py-2.5 rounded-[10px] text-white bg-[#8DA6FF] capitalize duration-300 hover:bg-[#668BFF]">
          edit
        </button>
      </div>
      <div className="card-body">

      </div>
      <div className="card-footer absolute w-[90%] bottom-5 flex justify-between items-center gap-3">
        <Button
          onClick={handleEdit}
          sx={{
            bgcolor: "#8DA6FF",
            color: "#fff",
            textTransform: "capitalize",
            borderRadius: "10px",
            ":hover": { bgcolor: "#668BFF" },
          }}
        >
          <span className="my-auto">Save</span>
          {isLoading && (
            <CircularProgress
              size={20}
              sx={{ color: "#fff", marginLeft: "10px" }}
            />
          )}
        </Button>
      </div>
    </div>
  );
}
