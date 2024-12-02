import { useId } from "react";

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
  time,
  date,
  className,
  ...props
}: CardEditProps) {
  const id = useId();

  return (
    <div
      className={`${className}  p-5 rounded-[20px] bg-[#fff] h-[400px] relative flex flex-col`}
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
      <div className="card-footer absolute bottom-5  flex items-center gap-3">
        <span className="px-5 py-2 text-md font-semibold text-gray-700 bg-yellow-200 rounded-full">
          Pending
        </span>
        <span className="text-gray-500 text-sm">10:30 AM</span>
      </div>
    </div>
  );
}
