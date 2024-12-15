import { Controller, useForm } from "react-hook-form";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "@/config/supabase/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";

interface ModalSignUpProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  email: string;
  fullname: string;
  username: string;
  birthday: string;
  password: string;
  confirmPassword: string;
  phone: number;
  address: string;
}

export default function ModalSignUp({ isOpen, onClose }: ModalSignUpProps) {
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState<"password" | "text">(
    "password"
  );
  const [showConfirmPassword, setShowConfirmPassword] = useState<
    "password" | "text"
  >("password");

  const togglePasswordVisibility = (): void =>
    setShowPassword((prevType) =>
      prevType === "password" ? "text" : "password"
    );

  const toggleConfirmPasswordVisibility = (): void =>
    setShowConfirmPassword((prevType) =>
      prevType === "password" ? "text" : "password"
    );

    const handleOnSubmit = async (data: FormData): Promise<void> => {
      try {
        const { data: signUpData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });
    
        if (authError) {
          console.error("Error during sign-up:", authError.message);
          alert("Failed to register. Please try again.");
          return;
        }
    
        const user = signUpData.user;
    
        if (!user) {
          console.error("User data is null after sign-up.");
          alert("Failed to retrieve user data. Please try again.");
          return;
        }
    
        const { error: dbError } = await supabase.from("user").insert({
          id: uuidv4(),
          fullname: data.fullname,
          username: data.username,
          email: data.email,
          phone: data.phone,
          password: data.password,
          birthday: data.birthday,
          address: data.address,
          created_at: new Date().toISOString(),
        });
    
        if (dbError) {
          throw new Error(dbError.message);
        }
    
        console.log("User registered successfully");
        onClose();
      } catch (error:any) {
        throw new Error(error.message || "Error signing up");
      }
    };
    

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          px: 5,
          py: 9,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Modal Title */}
        <Typography
          textAlign="center"
          fontWeight="bold"
          fontSize="1.5em"
          mb={1}
        >
          Sign Up
        </Typography>
        <Typography textAlign="center" color="text.secondary" mb={3}>
          Create an account to get started
        </Typography>

        {/* Input Form */}
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          {/* Fullname */}
          <Controller
            name="fullname"
            control={control}
            rules={{ required: "Fullname is required" }}
            render={({ field }) => (
              <TextField
                fullWidth
                margin="normal"
                label="Fullname"
                error={!!errors.fullname}
                helperText={errors.fullname?.message}
                {...field}
              />
            )}
          />

          {/* Email and Username */}
          <Box display={"flex"} alignItems={"center"} gap={"10px"}>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Username is required" }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Username"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  {...field}
                />
              )}
            />

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
                  margin="normal"
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...field}
                />
              )}
            />
          </Box>

          {/* Password and Confirm Password */}
          <Box display={"flex"} alignItems={"center"} gap={"10px"}>
            <div className="wrapper relative w-full">
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

            <div className="wrapper relative w-full">
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === getValues("password") || "Passwords do not match",
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
          </Box>

          {/* Birthday */}
          <Controller
            name="birthday"
            control={control}
            rules={{ required: "Birthday is required" }}
            render={({ field }) => (
              <TextField
                fullWidth
                margin="normal"
                type="date"
                error={!!errors.birthday}
                helperText={errors.birthday?.message}
                {...field}
              />
            )}
          />

          {/* Address */}
          <Controller
            name="address"
            control={control}
            rules={{ required: "Address is required" }}
            render={({ field }) => (
              <TextField
                fullWidth
                margin="normal"
                label="Address"
                error={!!errors.address}
                helperText={errors.address?.message}
                {...field}
              />
            )}
          />

          {/* Phone */}
          <Controller
            name="phone"
            control={control}
            rules={{ required: "Phone is required" }}
            render={({ field }) => (
              <TextField
                fullWidth
                margin="normal"
                label="Phone"
                type="number"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                {...field}
              />
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, borderRadius: "5px", bgcolor: "#0A66C2" }}
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
