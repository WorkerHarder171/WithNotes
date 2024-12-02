import { BiPaste } from "react-icons/bi";

export default function ToDoList() {
  return (
    <div className="wrapper h-[280px] p-5 rounded-[20px] bg-[#F2F2F2]">
      <div className="card rounded-[20px] h-[220px] bg-[#fff] p-5">
        {/* Header */}
        <div className="wrapper-text flex items-center gap-3 pb-5">
          <i>
            <BiPaste className="text-3xl" />
          </i>
          <p className="font-semibold text-3xl">To-do-list</p>
        </div>

        {/* To-Do List Item */}
        <div className="todo-item flex items-center mt-5 gap-5">
          <input
            type="checkbox"
            className="w-5 h-5 border-2 border-gray-400 rounded-md cursor-pointer"
          />
          <div className="wrapper flex flex-col gap-3">
            <p className="flex-1 text-xl font-medium">
              Prepare for the design meeting
            </p>

            <div className="flex items-center gap-3">
              <span className="px-5 py-2 text-sm font-semibold text-gray-700 bg-yellow-200 rounded-full">
                Pending
              </span>
              <span className="text-gray-500 text-sm">10:30 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
