import { MdOutlineStickyNote2 } from "react-icons/md";
import CardDefault from "@/components/card/CardDefault";
import CardEdit from "@/components/card/CardEdit";
import ToDoList from "./ToDoList";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase/supabaseClient";
import { IoMdSearch } from "react-icons/io";
import ModalAddNotes from "@/components/modals/notes/ModalAddNotes";

// Define type for notes
interface Note {
  id: string;
  title: string;
  desc: string;
  time: string;
  date: string;
  created_at: string;
}

const Notes: React.FC = () => {
  // State for notes and selected note
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isUpdate, setUpdate] = useState<boolean>(false);

  // Close modal handler
  const handleCloseModal = (): void => setModalOpen(false);
  const handleOnUpdate = (): void => {
    setUpdate(true); 
  };
  
  // Fetch notes data from Supabase
  const getData = async (): Promise<void> => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Error fetching user data:", authError.message);
        return;
      }

      if (user) {
        const { data: notesData, error: notesError } = await supabase
          .from("notes")
          .select("*")
          .eq("email", user.email);

        if (notesError) {
          console.error("Error fetching notes:", notesError.message);
        } else {
          console.log("Fetched notes:", notesData);
          handleOnUpdate();
          setNotes(notesData);
        }
      }
    } catch (error) {
      console.error("Unexpected error fetching notes:", error);
    }
  };

  // Handle note click to show details
  const handleOnClick = (id: string) => {
    setSelectedNoteId(id === selectedNoteId ? null : id);
  };

  // Fetch data on component mount and update state on note changes
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (isUpdate) {
      getData(); 
      setUpdate(false);
    }
  }, [isUpdate]);

  return (
    <>
      <div className="flex gap-10">
        {/* Notes List Section */}
        <div className="notes w-full h-[700px] p-8 rounded-[30px] border bg-white">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MdOutlineStickyNote2 className="text-2xl" />
              <p className="text-xl font-semibold capitalize">All Notes</p>
            </div>
          </div>

          {/* Notes Info */}
          <div className="flex justify-between items-center mt-10">
            <p className="text-xl font-semibold text-[#799CFF]">
              {notes.length} Notes
            </p>
            <button
              onClick={() => console.log("Search button clicked")}
              className="px-4 py-2 text-white bg-[#799CFF] rounded-[10px] hover:bg-[#668BFF]"
            >
              <IoMdSearch className="text-xl" />
            </button>
          </div>

          {/* Notes List */}
          <div className="mt-10 flex flex-col gap-4 overflow-y-scroll scrollbar scrollbar-thumb-[#aaa] scrollbar-track-[#2A2A2A] scrollbar-thumb-rounded-lg h-[calc(100%-180px)]">
            {notes.map((note) => (
              <CardDefault
                onClick={() => handleOnClick(note.id)}
                title={note.title}
                lead={note.desc}
                time={note.time}
                date={note.created_at}
                key={note.id}
              />
            ))}
          </div>
        </div>

        {/* Note Details Section */}
        <div className="w-full flex flex-col gap-5">
          {notes
            .filter((note) => note.id === selectedNoteId)
            .map((note) => (
              <CardEdit
                className={selectedNoteId ? "block" : "hidden"}
                title={note.title}
                lead={note.desc}
                key={note.id}
              />
            ))}
          <ToDoList />
        </div>
      </div>

      {/* Modal for Adding Notes */}
      <ModalAddNotes
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDataUpdate={handleOnUpdate}
      />
    </>
  );
};

export default Notes;
