import { FaPlus } from "react-icons/fa6";
import { MdOutlineStickyNote2 } from "react-icons/md";
import CardDefault from "@/components/card/CardDefault";
import CardEdit from "@/components/card/CardEdit";
import ToDoList from "./ToDoList";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase/supabaseClient";
import { IoMdSearch } from "react-icons/io";
import ModalAddNotes from "@/components/modals/notes/ModalAddNotes";

export default function Notes(): JSX.Element {
  const [user, setUser] = useState<string[]>([]);
  const [show, setShow] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = (): void => setOpenModal(true);
  const handleCloseModal = (): void => setOpenModal(false);

  const getData = async (): Promise<void> => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
  
    if (authError) {
      console.error("Error fetching user data:", authError.message);
      return;
    }
  
    if (user) {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("email", user.email); 
  
      if (error) {
        console.error("Error fetching notes:", error.message);
      } else {
        console.log("Fetched data: ", data);
        setUser(data || []);
      }
    }
  };
  

  // Show note details
  const handleOnClick = (id: string) => {
    setShow(id === show ? null : id);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="flex gap-10">
        <div className="notes w-full h-[700px] p-8 rounded-[30px] border bg-white">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MdOutlineStickyNote2 className="text-2xl" />
              <p className="text-xl font-semibold capitalize">All Notes</p>
            </div>
            <button
              aria-label="Add Note"
              className="p-2 rounded hover:bg-gray-100"
              onClick={handleOpenModal}
            >
              <FaPlus className="text-3xl" />
            </button>
          </div>

          {/* Note Details */}
          <div className="flex justify-between items-center mt-10">
            <p className="text-xl font-semibold text-[#799CFF]">124 Notes</p>
            <button className="px-4 py-2 text-white bg-[#799CFF] rounded-[10px] rounded hover:bg-[#668BFF]">
              <IoMdSearch className="text-xl" />
            </button>
          </div>

          {/* Notes List */}
          <div className="mt-10 flex flex-col gap-4 overflow-y-scroll scrollbar scrollbar-thumb-[#aaa] scrollbar-track-[#2A2A2A] scrollbar-thumb-rounded-lg h-[calc(100%-180px)]">
            {user.map((item) => (
              <CardDefault
                onClick={() => {
                  handleOnClick(item.id);
                }}
                title={item.title}
                lead={item.desc}
                time={item.time}
                date={item.created_at}
                key={item.id}
              />
            ))}
          </div>
        </div>
        <div className="w-full flex flex-col gap-5">
          {user
            .filter((item) => item.id === show)
            .map((item) => (
              <CardEdit
                className={`${show ? "block" : "hidden"}`}
                title={item.title}
                lead={item.desc}
                time={item.time}
                date={item.created_at}
                key={item.id}
              />
            ))}
          <ToDoList />
        </div>
      </div>

      {/* Modal Add Notes */}
      <ModalAddNotes isOpen={openModal} onClose={handleCloseModal} />
    </>
  );
}
