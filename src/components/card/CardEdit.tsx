import { useId } from "react";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useState } from "react";
import { Button } from "@mui/material";
interface CardEditProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  lead: string;
  time?: string;
  date?: Date;
  className?: string;
}

export default function CardEdit({
  title,
  lead,
  className,
  ...props
}: CardEditProps) {
  const id = useId();

  const [formats, setFormats] = useState(() => ["bold", "italic"]);

  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    setFormats(newFormats);
  };

  return (
    <div
      className={`${className}  p-5 rounded-[20px] bg-[#fff] h-[400px] relative flex flex-col relative`}
      id={`card-${id}`}
      {...props}
    >
      <div className="card-header flex justify-between items-center border-b py-5 border-[#ddd]">
        <p className="text-3xl font-semibold">{title}</p>
        <button className="px-5 py-2.5 rounded-[10px] text-white bg-[#8DA6FF] capitalize duration-300 hover:bg-[#668BFF] ">
          edit
        </button>
      </div>
      <div className="card-body">
        <p className="py-5">{lead}</p>
      </div>
      <div className="card-footer absolute w-[90%] bottom-5 flex justify-between items-center gap-3">
        <ToggleButtonGroup
          value={formats}
          onChange={handleFormat}
          aria-label="text formatting"
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <Button
          sx={{
            bgcolor: "#8DA6FF",
            color: "#fff",
            textTransform: "capitalize",
            borderRadius: "10px",
            ":hover":{bgcolor:"#668BFF"}
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
