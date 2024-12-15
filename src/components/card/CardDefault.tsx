import { useId } from "react";
import data from "@/assets/data.png";
import laptop from "@/assets/laptop.png";
import notes from "@/assets/notes.png";

interface CardDefaultProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  lead: string;
  time?: string;
  date?: string;
  className?: string;
}

export const image = [{ img: data }, { img: laptop }, { img: notes }];
export const bg = ["#BAB3FF", "#FFD27D"];

export default function CardDefault({
  onClick,
  title,
  lead,
  date,
  className,
  ...props
}: CardDefaultProps) {
  const id = useId();
  const titleLength = 100;

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";

    const dateParts = dateStr.split("-");
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];

    return `${day}-${month}-${year}`;
  };

  const randomImg = image[Math.floor(Math.random() * image.length)];
  const randomBg = bg[Math.floor(Math.random() * bg.length)];

  return (
    <div
      className={`${className} card p-5 rounded-[20px] bg-[#F7F7F7] hover:bg-[#E8EDFF] h-[250px] flex flex-col justify-center items-start cursor-pointer`}
      id={`card-${id}`}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-center gap-5">
        <div className={`wrapper-img w-4/12 my-auto rounded-[10px] min-w-[150px]`}
        style={{ backgroundColor: randomBg }}>
          <img
            className={` h-[150px] object-cover rounded-10px `}
            src={randomImg.img}
          />
        </div>
        <div className="wrapper-text w-8/12">
          <div className="card-header">
            <p className="title-text font-semibold text-2xl capitalize">
              {title}
            </p>
            <p className="lead font-thin text-lg max-w-xl my-3">
              {lead.length > titleLength
                ? lead.slice(0, titleLength) + "..."
                : lead}
            </p>
          </div>
          <div className="card-footer">
            <div className="wrapper-info flex items-center gap-5">
              <p className="date">{formatDate(date)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
