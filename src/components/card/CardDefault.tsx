import { useId } from "react";

interface CardDefaultProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  lead: string;
  time?: string;
  date?: string;
  className?: string;
}

export default function CardDefault({
  onClick,
  title,
  lead,
  time,
  date,
  className,
  ...props
}: CardDefaultProps) {
  const id = useId();

  return (
    <div
      className={`${className} card p-5 rounded-[20px] bg-[#F7F7F7] hover:bg-[#E8EDFF] h-[250px] flex flex-col justify-between cursor-pointer`}
      id={`card-${id}`}
      onClick={onClick}
      {...props}
    >
      <div className="card-header">
        <p className="title-text font-semibold text-2xl mt-2">{title}</p>
        <p className="lead font-thin text-lg max-w-xl my-5">{lead}</p>
      </div>
      <div className="card-footer">
        <div className="wrapper-info flex items-center gap-5">
          <p className="time px-4 py-1 rounded-[20px] bg-[#E9E9E9]">{time}</p>
          <p className="date">{date}</p>
        </div>
      </div>
    </div>
  );
}
