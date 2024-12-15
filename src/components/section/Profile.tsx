import pp from "@/assets/pp.jpg";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { CircularProgress } from "@mui/material";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface FormData {
  fullname: string;
  username: string;
  email: string;
  password: string;
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
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState<"password" | "text">(
    "password"
  );


  const togglePasswordVisibility = (): void =>
    setShowPassword((prevType) =>
      prevType === "password" ? "text" : "password"
    );

  // Fetch user data from Supabase
  async function fetchUserData() {
    setIsLoading(true);
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
        console.error("Error fetching user data:", fetchError.message);
      } else {
        setUserId(userData.id);
        setValue("fullname", userData.fullname);
        setValue("username", userData.username);
        setValue("email", userData.email);
        setValue("password", userData.password);
        setValue("birthday", userData.birthday);
        setValue("address", userData.address);
        setValue("phone", userData.phone);
        setProfilePicture(userData.pictures);
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle form submission
  async function handleOnSubmit(data: FormData) {
    if (!userId) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("user")
        .update({
          fullname: data.fullname,
          username: data.username,
          email: data.email,
          password: data.password,
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
        console.log("ini merupakan profile", profilePicture);
      }
    } catch (error) {
      console.error("Error in handleOnSubmit:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle file upload
  async function handleFileUpload() {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const filePath = `images/${uuidv4()}_${selectedFile.name}`;
      const { error } = await supabase.storage
        .from("images")
        .upload(filePath, selectedFile);

      if (error) {
        console.error("Error uploading file:", error.message);
        return;
      }

      const fileUrl = supabase.storage.from("images").getPublicUrl(filePath)
        .data.publicUrl;

      const { error: updateError } = await supabase
        .from("user")
        .update({ pictures: fileUrl })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating user data:", updateError.message);
      } else {
        setProfilePicture(fileUrl);
        alert("Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error in handleFileUpload:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handle delete picture
  async function handleDeletePicture() {
    if (!profilePicture) return;

    setIsLoading(true);
    try {
      const filePath = profilePicture.split("/").pop();
      const { error: deleteError } = await supabase.storage
        .from("images")
        .remove([`images/${filePath}`]);

      if (deleteError) {
        console.error("Error deleting file:", deleteError.message);
        return;
      }
      const { error: updateError } = await supabase
        .from("user")
        .update({ pictures: null })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating user data:", updateError.message);
      } else {
        setProfilePicture(null);
        alert("Profile picture deleted successfully!");
      }
    } catch (error) {
      console.error("Error in handleDeletePicture:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full bg-[#E2E6E9] ">
      <div className="bg-[#fff] p-10 rounded-[10px] border shadow">
        <div className="navbar mb-5">
          <p className="text-xl capitalize font-semibold text-left">Profile</p>
        </div>

        {/* Profile Picture */}
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          {isLoading ? (
            <CircularProgress size={30} />
          ) : (
            <img
              src={profilePicture || pp}
              alt="Profile Picture"
              className="w-[100px] h-[100px] object-cover border rounded-full"
            />
          )}
        </Box>

        {/* File Upload */}
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"10px"}
          mt={2}
        >
          {selectedFile ? (
            <Button
              variant="contained"
              color="success"
              onClick={handleFileUpload}
              disabled={!selectedFile && isLoading}
            >
              {isLoading ? "Uploading..." : "Upload Picture"}
            </Button>
          ) : (
            <Button variant="contained" component="label">
              Change Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          )}

          <Button
            variant="outlined"
            color="error"
            onClick={handleDeletePicture}
            disabled={!profilePicture}
          >
            Delete Picture
          </Button>
        </Box>

        {/* File Upload Status */}
        <Box display="flex" justifyContent="center" mt={1}>
          {selectedFile ? (
            <p>Selected file: {selectedFile.name}</p>
          ) : (
            <p>No file selected</p>
          )}
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit(handleOnSubmit)} className="w-full mt-10 ">
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

            <Grid item xs={6}>
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

            <Grid
              item
              xs={6}
              sx={{
                position: "relative",
              }}
            >
              <Controller
                name="password"
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    type={showPassword}
                    InputLabelProps={{ shrink: !!field.value }}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...field}
                    sx={{
                      padding: "0px",
                      margin: "0px",
                    }}
                  />
                )}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="wrapper-icon absolute right-5 top-10"
              >
                {showPassword === "password" ? (
                  <FaRegEyeSlash size={24} />
                ) : (
                  <FaRegEye size={24} />
                )}
              </button>
            </Grid>

            {/* Password Action */}
            {/* <Grid item xs={12} sm={6}>
              <div className="wrapper relative p-0">
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: "Password is required" }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Password"
                      type={showPassword}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      {...field}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="wrapper-icon flex absolute right-5 top-8"
                >
                  {showPassword === "password" ? (
                    <FaRegEyeSlash size={24} />
                  ) : (
                    <FaRegEye size={24} />
                  )}
                </button>
              </div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <div className="wrapper relative p-0">
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Passwords do not match",
                  }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Confirm Password"
                      type={showConfirmPassword}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      {...field}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="wrapper-icon flex absolute right-5 top-8"
                >
                  {showConfirmPassword === "password" ? (
                    <FaRegEyeSlash size={24} />
                  ) : (
                    <FaRegEye size={24} />
                  )}
                </button>
              </div>
            </Grid> */}
            {/* End of Password Action */}

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
  );
}
