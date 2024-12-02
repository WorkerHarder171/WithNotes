import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "@/config/supabase/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";

interface ModalAddNotesProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  title: string;
  desc: string;
}

export default function ModalAddNotes({
  isOpen,
  onClose,
}: ModalAddNotesProps): JSX.Element {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
      }
      if (error) {
        console.error("Error fetching user:", error.message);
      }
    };
    getUserEmail();
  }, []);

  const handleOnSubmit = async (data: FormData): Promise<void> => {
    try {
      const { error } = await supabase.from("notes").insert([
        {
          id: uuidv4(),
          title: data.title,
          desc: data.desc,
          email: userEmail,
          created_at: new Date(),
        },
      ]);

      if (error) {
        console.error("Error inserting notes:", error.message);
        return;
      }
      reset();
      onClose();
    } catch (err) {
      console.error("Error inserting notes:", err);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          px: 5,
          py: 5,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography textAlign="center" fontWeight="bold" fontSize="1.5em" mb={1}>
          Add a New Note
        </Typography>

        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title"
                variant="outlined"
                fullWidth
                margin="normal"
                error={Boolean(errors.title)}
                helperText={errors.title?.message || ""}
              />
            )}
          />

          <Controller
            name="desc"
            control={control}
            defaultValue=""
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                error={Boolean(errors.desc)}
                helperText={errors.desc?.message || ""}
              />
            )}
          />

          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
