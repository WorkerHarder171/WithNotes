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
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase/supabaseClient";
import { authService } from "@/config/auth";
import { useNavigate } from "react-router-dom";
import { AuthError, Session } from "@supabase/supabase-js";
import ModalSignUp from "../sign-up/ModalSignUp";

interface ModalSignInProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  email: string;
  password: string;
  remember?: boolean;
}

const ModalSignIn: React.FC<ModalSignInProps> = ({ isOpen, onClose }) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = (): void => setOpenModal(true);
  const handleCloseModal = (): void => setOpenModal(false);

  const handleLoginWithEmail = async (data: FormData): Promise<boolean> => {
    try {
      const { email, password } = data;
      const {
        data: session,
        error,
      }: { data: Session | null; error: AuthError | null } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setErrorMessage(error.message);
        console.error("Login failed:", error.message);
        return false;
      }

      if (session) {
        authService.storeCredentialsToken({
          token: session.session?.access_token!,
          refreshToken: session.session?.refresh_token!,
          oauthAccessToken: session.user?.email!,
        });
        console.log("Login successful:", session);
        navigate("/dashboard");
        return true;
      }
    } catch (err) {
      setErrorMessage("Unexpected error during login.");
      console.error("Login error:", err);
    }
    return false;
  };

  
  const handleOnSubmit = async (data: FormData): Promise<void> => {
    const isLoginSuccessful = await handleLoginWithEmail(data);
    if (isLoginSuccessful) {
      onClose();
    }
  };

  const handleOnClick = (): void => {
    onClose();
    handleOpenModal();
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
      setErrorMessage(null);
    }
  }, [isOpen, reset]);

  return (
    <>
      <ModalSignUp isOpen={openModal} onClose={handleCloseModal} />

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
            Login to Get Started
          </Typography>
          <Typography textAlign="center" color="text.secondary" mb={3}>
            Welcome Back! Let’s Groove
          </Typography>

          {/* Social Media Login Buttons */}
          <Box display="flex" justifyContent="space-around" gap={1} mb={3}>
            <Button
              // Uncomment and implement OAuth method
              variant="contained"
              size="large"
              sx={{
                borderRadius: "20px",
                minWidth: "50px",
                height: "50px",
                bgcolor: "#1877F2",
              }}
            >
              <FaFacebook style={{ fontSize: "24px" }} />
            </Button>
            <Button
              // Uncomment and implement OAuth method
              variant="contained"
              size="large"
              sx={{
                borderRadius: "20px",
                minWidth: "50px",
                height: "50px",
                bgcolor: "#DB4437",
              }}
            >
              <FaGoogle style={{ fontSize: "24px" }} />
            </Button>
            <Button
              // Uncomment and implement OAuth method
              variant="contained"
              size="large"
              sx={{
                borderRadius: "20px",
                minWidth: "50px",
                height: "50px",
                bgcolor: "#333",
              }}
            >
              <FaGithub style={{ fontSize: "24px" }} />
            </Button>
          </Box>

          <Typography textAlign="center" color="text.secondary" mb={2}>
            OR
          </Typography>

          {/* Input Form */}
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
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  {...field}
                />
              )}
            />

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
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            mt={2}
            fontSize="0.9rem"
          >
            Don’t have an account?{" "}
            <Button
              onClick={handleOnClick}
              color="primary.min"
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
