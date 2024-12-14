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
  date,
  className,
  ...props
}: CardDefaultProps) {
  const id = useId();

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";

    const dateParts = dateStr.split("-");
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];

    return `${day}-${month}-${year}`;
  };

  return (
    <div
      className={`${className} card p-5 rounded-[20px] bg-[#F7F7F7] hover:bg-[#E8EDFF] h-[250px] flex flex-col justify-between cursor-pointer`}
      id={`card-${id}`}
      onClick={onClick}
      {...props}
    >
      <div className="card-header">
        <p className="title-text font-semibold text-2xl mt-2 capitalize">{title}</p>
        <p className="lead font-thin text-lg max-w-xl my-5">{lead}</p>
      </div>
      <div className="card-footer">
        <div className="wrapper-info flex items-center gap-5">
          <p className="date">{formatDate(date)}</p>
        </div>
      </div>
    </div>
  );
}
