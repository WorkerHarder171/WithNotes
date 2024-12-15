import { useId, useState } from "react";
import { Button, TextField } from "@mui/material";

interface CardEditProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  lead: string;
  time?: string;
  date?: Date;
  className?: string;
}

export default function CardEdit({
  title: initialTitle,
  lead: initialLead,
  className,
  ...props
}: CardEditProps) {
  const id = useId();

  // State for managing the card's content
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [lead, setLead] = useState(initialLead);

  // Handlers for toggling edit mode
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const saveChanges = async():Promise<void> => {
    setIsEditing(false);
    const {data, error} =  await supabase.from("notes").update({title, lead}).eq("id", id);

    if(error) throw new Error(error.message || "Failed to update note");

    if(data){
      console.log("Note updated successfully");
    }
  };

  return (
    <div
      className={`${className} p-5 rounded-[10px] bg-[#fff] h-[445px] relative flex flex-col`}
      id={`card-${id}`}
      {...props}
    >
      <div className="card-header gap-5 flex justify-between items-center border-b py-5 border-[#ddd]">
        {isEditing ? (
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          />
        ) : (
          <p className="text-3xl font-semibold">{title}</p>
        )}
        <button
          className="px-5 py-2.5 rounded-[10px] text-white bg-[#8DA6FF] capitalize duration-300 hover:bg-[#668BFF]"
          onClick={toggleEdit}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>
      <div className="card-body mt-2">
        {isEditing ? (
          <TextField
            value={lead}
            onChange={(e) => setLead(e.target.value)}
            variant="outlined"
            multiline
            fullWidth
            rows={7}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          />
        ) : (
          <p className="py-5">{lead}</p>
        )}
      </div>
      <div className="card-footer absolute bottom-7 right-5 gap-3">
        {isEditing && (
          <Button
            sx={{
              bgcolor: "#8DA6FF",
              color: "#fff",
              textTransform: "capitalize",
              borderRadius: "10px",
              ":hover": { bgcolor: "#668BFF" },
            }}
            onClick={saveChanges}
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
}
