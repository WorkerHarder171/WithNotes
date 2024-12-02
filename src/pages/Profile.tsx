import pp from "@/assets/pp.jpg";
import { LayoutDashboardContent } from "../layout/LayoutDashboardContent";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase/supabaseClient";

interface FormData {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthday: string;
  address: string;
  phone: string;
}

export default function Profile(): JSX.Element {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [userId, setUserId] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function fetchUserData() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Error fetching authenticated user:", error);
        return;
      }

      const { data: userData, error: fetchError } = await supabase
        .from("user")
        .select("*")
        .eq("email", user.email)
        .single();

      if (fetchError) {
        console.error(
          "Error fetching user data from table:",
          fetchError.message
        );
      } else {
        setUserId(userData.id);
        setValue("fullname", userData.fullname);
        setValue("username", userData.username);
        setValue("email", userData.email);
        setValue("birthday", userData.birthday);
        setValue("address", userData.address);
        setValue("phone", userData.phone);
        setProfilePicture(userData.profile_picture);
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    }
  }

  useEffect(() => {
    fetchUserData();
  });

  async function handleOnSubmit(data: FormData) {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("user")
        .update({
          fullname: data.fullname,
          username: data.username,
          email: data.email,
          birthday: data.birthday,
          address: data.address,
          phone: data.phone,
        })
        .eq("id", userId);

      if (error) {
        console.error("Error updating user data:", error.message);
        alert("Failed to update profile!");
      } else {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error in handleOnSubmit:", error);
    }
  }

  async function handleFileUpload() {
    if (!selectedFile || !userId) return;

    const fileName = `pictures/${userId}-${selectedFile.name}`;
    const { data, error } = await supabase.storage
      .from("pictures")
      .upload(fileName, selectedFile);

    if (error) {
      console.error("Error uploading file:", error.message);
    } else if (data) {
      const publicUrl = supabase.storage
        .from("pictures")
        .getPublicUrl(fileName).data.publicUrl;

      await supabase
        .from("user")
        .update({ pictures: publicUrl })
        .eq("id", userId);

      setProfilePicture(publicUrl);
      alert("Profile picture updated successfully!");
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <LayoutDashboardContent>
      <div className="w-full bg-[#E2E6E9]">
        <div className="bg-[#fff]  p-10 rounded-[10px] border shadow">
          <div className="navbar mb-10">
            <p className="text-xl capitalize font-semibold text-left">
              Profile
            </p>
          </div>

          <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <img
              src={profilePicture || pp}
              alt="Profile Picture"
              className="w-[100px] h-[100px] object-cover border rounded-full"
            />
          </Box>

          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={"10px"}
            mt={2}
          >
            {!selectedFile ? (
              <Button variant="contained" component="label">
                Change Picture
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={handleFileUpload}
                disabled={!selectedFile}
              >
                Upload Picture
              </Button>
            )}

            <Button variant="outlined" color="error" onClick={handleFileUpload}>
              Delete Picture
            </Button>
          </Box>

          {/* Menampilkan status file yang dipilih */}
          <Box display="flex" justifyContent="center" mt={1}>
            {selectedFile ? (
              <p>Selected file: {selectedFile.name}</p>
            ) : (
              <p>No file selected</p>
            )}
          </Box>

          <form
            onSubmit={handleSubmit(handleOnSubmit)}
            className="w-full mt-10 "
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="fullname"
                  control={control}
                  rules={{ required: "Fullname is required" }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Fullname"
                      InputLabelProps={{ shrink: !!field.value }}
                      error={!!errors.fullname}
                      helperText={errors.fullname?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="username"
                  control={control}
                  rules={{ required: "Username is required" }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Username"
                      InputLabelProps={{ shrink: !!field.value }}
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      InputLabelProps={{ shrink: !!field.value }}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="birthday"
                  control={control}
                  rules={{ required: "Birthday is required" }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Birthday"
                      type="date"
                      InputLabelProps={{ shrink: !!field.value }}
                      error={!!errors.birthday}
                      helperText={errors.birthday?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: "Phone is required" }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Phone"
                      type="number"
                      InputLabelProps={{ shrink: !!field.value }}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="address"
                  control={control}
                  rules={{ required: "Address is required" }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Address"
                      InputLabelProps={{ shrink: !!field.value }}
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ textTransform: "capitalize" }}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </LayoutDashboardContent>
  );
}
