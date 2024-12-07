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
  const [isSignUpModalOpen, setSignUpModalOpen] = useState<boolean>(false);

  const handleOpenSignUpModal = (): void => setSignUpModalOpen(true);
  const handleCloseSignUpModal = (): void => setSignUpModalOpen(false);

  const checkIfUserExists = async (email: string) => {
    const { data, error } = await supabase
      .from("user")
      .select("email")
      .eq("email", email)
      .single();

    if (error || !data) {
      setSignUpModalOpen(true);
      return false;
    }
    return true;
  };

const chekIfCanLogin = async(email:string) => {


}

  const handleLoginWithOAuth = async (
    provider: "google" | "github" | "facebook"
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        console.error("OAuth login failed:", error.message);
        return false;
      }

      if (data?.user) {
        const userExists = await checkIfUserExists(data.user.email);
        if (!userExists) {
          return false;
        }
      }

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData?.session) {
        setErrorMessage(sessionError?.message || "Failed to retrieve session.");
        console.error("Failed to retrieve session:", sessionError?.message);
        return false;
      }
      const { access_token, refresh_token, user } = sessionData.session;
      authService.storeCredentialsToken({
        token: access_token,
        refreshToken: refresh_token,
        oauthAccessToken: user?.email ?? "",
      });

      console.log("OAuth login successful:", sessionData);
      navigate("/dashboard");
      return true;
    } catch (err) {
      setErrorMessage("Unexpected error during OAuth login.");
      console.error("OAuth login error:", err);
      return false;
    }
  };

  // Function to handle login with email and password
  const handleLoginWithEmail = async (data: FormData): Promise<boolean> => {
    try {
      const { email, password } = data;
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
        authService.storeCredentialsToken({
          token: access_token,
          refreshToken: refresh_token,
          oauthAccessToken: loginResponse.user?.email ?? "",
        });

        console.log("Login successful:", loginResponse);
        navigate("/dashboard");
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

  const handleSignUpRedirect = (): void => {
    onClose();
    handleOpenSignUpModal();
  };

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

          {/* Social Media Login Buttons */}
          <Box display="flex" justifyContent="space-around" gap={1} mb={3}>
            <Button
              onClick={() => handleLoginWithOAuth("facebook")}
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
              onClick={() => handleLoginWithOAuth("google")}
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
              onClick={() => handleLoginWithOAuth("github")}
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
              onClick={handleSignUpRedirect}
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
