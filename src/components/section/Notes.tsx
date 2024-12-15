import { MdOutlineStickyNote2 } from "react-icons/md";
import CardDefault from "@/components/card/CardDefault";
import CardEdit from "@/components/card/CardEdit";
import ToDoList from "./ToDoList";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase/supabaseClient";
import { IoMdSearch } from "react-icons/io";
import ModalAddNotes from "@/components/modals/notes/ModalAddNotes";
import { CircularProgress } from "@mui/material";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        throw new Error(authError.message || "Error fetching user data");
      }

      if (user) {
        const { data: notesData, error: notesError } = await supabase
          .from("notes")
          .select("*")
          .eq("email", user.email);

        if (notesError) {
          throw new Error(notesError.message || "Error fetching notes");
        } else {
          handleOnUpdate();
          setNotes(notesData);
        }
      }
    } catch (error) {
      throw new Error(error.message || "Error fetching notes");
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
    }
  }, [isUpdate]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 1000);
  }, []);

  return (
    <>
      <div className="flex gap-5">
        {/* Notes List Section */}
        <div className="notes w-full h-[700px] p-8 rounded-[10px] border bg-white">
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
          <div className="mt-10 flex flex-col gap-4 overflow-y-scroll h-[calc(100%-170px)] scrollbar scrollbar-thumb-[#2A2A2A] scrollbar-track-[#f4f4f4] scrollbar-thumb-rounded-lg">
            {isLoading ? (
              notes.map((note) => (
                <CardDefault
                  onClick={() => handleOnClick(note.id)}
                  title={note.title}
                  lead={note.desc}
                  time={note.time}
                  date={note.created_at}
                  key={note.id}
                />
              ))
            ) : (<p className="text-center"> Loading ...</p>)}
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
