import { useId } from "react";
import data from "@/assets/data.png";

interface CardDefaultProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  desc: string;
  time?: string;
  date?: string;
  className?: string;
}

export const bg = ["#BAB3FF"];

export default function CardDefault({
  onClick,
  title,
  desc,
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

  const randomBg = bg;

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
            src={data}
          />
        </div>
        <div className="wrapper-text w-8/12">
          <div className="card-header">
            <p className="title-text font-semibold text-2xl capitalize">
              {title}
            </p>
            <p className="lead font-thin text-lg max-w-xl my-3">
              {desc.length > titleLength
                ? desc.slice(0, titleLength) + "..."
                : desc}
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
