import { Controller, useForm } from "react-hook-form";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase/supabaseClient";
import { authService } from "@/config/auth";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import ModalSignUp from "../sign-up/ModalSignUp";

interface ModalSignInProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorized: () => void;
}

interface FormData {
  email: string;
  password: string;
  remember?: boolean;
}

const ModalSignIn: React.FC<ModalSignInProps> = ({
  isOpen,
  onClose,
  onAuthorized,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSignUpModalOpen, setSignUpModalOpen] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<"password" | "text">(
    "password"
  );

  // Handle visibility toggle for password
  const handleTogglePasswordVisibility = (): void => {
    setShowPassword((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  // Open/Close Sign Up Modal
  const handleOpenSignUpModal = (): void => setSignUpModalOpen(true);
  const handleCloseSignUpModal = (): void => setSignUpModalOpen(false);

  // Handle login
  const handleLoginWithEmail = async (data: FormData): Promise<boolean> => {
    try {
      const { email, password, remember } = data;
      const { data: loginResponse, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setErrorMessage(error.message);
        console.error("Login failed:", error.message);
        return false;
      }

      if (loginResponse.session) {
        const { access_token, refresh_token } = loginResponse.session;

        // Save token based on "Remember Me"
        if (remember) {
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
        } else {
          sessionStorage.setItem("access_token", access_token);
          sessionStorage.setItem("refresh_token", refresh_token);
        }

        authService.storeCredentialsToken({
          token: access_token,
          refreshToken: refresh_token,
          oauthAccessToken: loginResponse.user?.email ?? "",
        });

        console.log("Login successful:", loginResponse);
        navigate("/dashboard");
        onAuthorized();
        return true;
      }
    } catch (err) {
      setErrorMessage("Unexpected error during login.");
      console.error("Login error:", err);
    }
    return false;
  };

  // Submit handler
  const handleOnSubmit = async (data: FormData): Promise<void> => {
    const isLoginSuccessful = await handleLoginWithEmail(data);
    if (isLoginSuccessful) {
      onClose();
    }
  };

  // Reset form and error message on modal close
  useEffect(() => {
    if (!isOpen) {
      reset();
      setErrorMessage(null);
    }
  }, [isOpen, reset]);

  return (
    <>
      {/* Sign-Up Modal */}
      <ModalSignUp
        isOpen={isSignUpModalOpen}
        onClose={handleCloseSignUpModal}
      />

      {/* Sign-In Modal */}
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="sign-in-modal"
        aria-describedby="sign-in-modal-description"
      >
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
            py: 9,
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
            aria-label="Close sign-in modal"
          >
            <CloseIcon />
          </IconButton>

          {/* Modal Title */}
          <Typography
            id="sign-in-modal"
            textAlign="center"
            fontWeight="bold"
            fontSize="1.5em"
            mb={1}
          >
            Login to Get Started
          </Typography>
          <Typography
            id="sign-in-modal-description"
            textAlign="center"
            color="text.secondary"
            mb={3}
          >
            Welcome Back! Let’s Groove
          </Typography>

          {/* Form */}
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            {/* Email Input */}
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

            {/* Password Input */}
            <div className="wrapper relative">
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
                onClick={handleTogglePasswordVisibility}
                className="wrapper-icon flex absolute right-5 top-8"
              >
                {showPassword === "password" ? (
                  <FaRegEyeSlash size={24} />
                ) : (
                  <FaRegEye size={24} />
                )}
              </button>
            </div>

            {/* Remember Me */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <FormControlLabel
                control={
                  <Controller
                    name="remember"
                    control={control}
                    render={({ field }) => (
                      <Checkbox {...field} color="primary" />
                    )}
                  />
                }
                label="Remember Me"
              />
              <Typography
                component="a"
                href="#"
                fontSize="0.9rem"
                color="primary.main"
                sx={{ textDecoration: "none" }}
              >
                Forgot Password?
              </Typography>
            </Box>

            {/* Login Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, borderRadius: "10px", bgcolor: "#0A66C2" }}
            >
              Login
            </Button>
          </form>

          {errorMessage && (
            <Typography color="error" textAlign="center" mt={2}>
              {errorMessage}
            </Typography>
          )}

          <Typography
            textAlign="center"
            mt={2}
            fontSize="0.9rem"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            Don’t have an account?{" "}
            <Button
              onClick={handleOpenSignUpModal}
              sx={{
                textDecoration: "none",
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default ModalSignIn;
