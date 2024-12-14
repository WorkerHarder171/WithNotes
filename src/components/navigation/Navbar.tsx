import { useState, useEffect } from "react";
import { RiSettingsLine } from "react-icons/ri";
import { IoLogIn } from "react-icons/io5";
import { authService } from "@/config/auth";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/config/supabase/supabaseClient";
import { FaPlus } from "react-icons/fa6";
import ModalAddNotes from "@/components/modals/notes/ModalAddNotes";
import ModalSignIn from "@/components/modals/sign-in/ModalSignIn";

export default function Navbar(): JSX.Element {
  // State Management
  const [user, setUser] = useState<{
    username: string;
    pictures: string;
  } | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(authService.isAuthorized());

  const handleAutrorized = async (): Promise<void> => {
    const isAuth = await authService.isAuthorized();
    setIsAuthorized(isAuth);
  };
  // State for current path
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.hash.substring(1) || "all"
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  // Separate state for modals
  const [isAddNotesModalOpen, setAddNotesModalOpen] = useState<boolean>(false);
  const [isSignInModalOpen, setSignInModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  // Get avatar initials
  const getAvatarInitials = (username: string): string => {
    const nameParts = username.split(" ");
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial =
      nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  // Fetch user data
  const getUser = async (): Promise<void> => {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) {
        console.error("Error fetching user auth data:", authError.message);
        return;
      }

      if (authData?.user) {
        const { data, error } = await supabase
          .from("user")
          .select("username, pictures")
          .eq("email", authData.user.email)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error.message);
        } else {
          setIsAuthorized(true);
          setUser(data);
        }
      }
    } catch (error) {
      console.error("Unexpected error in getUser:", error);
    }
  };

  // Handle menu actions
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuProfile = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthorized(false);
    setUser(null);
    navigate("/");
    handleMenuClose();
  };

  // Effect to load user data
  useEffect(() => {
    if (isAuthorized) {
      getUser();
      setIsAuthorized(true);
    }

    const handleHashChange = () => {
      setCurrentPath(window.location.hash.substring(1) || "all");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [isAuthorized]);

  // Navigation Items
  const navItems = [
    { name: "All", link: "#all" },
    { name: "Projects", link: "#projects" },
    { name: "Meeting", link: "#meeting" },
    { name: "Design", link: "#design" },
  ];

  return (
    <>
      <nav className="bg-[#fff] mx-auto z-0 w-[60%] flex justify-between items-center relative rounded-[20px] shadow shadow-sm px-10 py-5 poppins">
        {/* Profile Section */}
        <div
          className={`nav-brand flex items-center gap-5 cursor-pointer ${
            isAuthorized ? "" : "hidden"
          }`}
          onClick={() => navigate("/dashboard")}
        >
          {user?.pictures ? (
            <img
              className="rounded-full object-cover w-[50px] h-[50px]"
              src={user.pictures}
              alt="Profile"
            />
          ) : (
            <Avatar>
              {user?.username ? getAvatarInitials(user.username) : "?"}
            </Avatar>
          )}
          <p className="name-profile font-medium text-xl">
            {user?.username || ""}
          </p>
        </div>

        {/* Navigation Links */}
        <ul className="nav navbar w-[45%] flex items-center justify-evenly">
          {navItems.map((item, index) => (
            <li className="nav-item" key={index}>
              <a
                href={item.link}
                className={`nav-link font-medium px-5 py-2 rounded-[10px] hover:bg-[#eee] hover:text-black duration-300 ${
                  currentPath === item.link.substring(1)
                    ? "bg-[#8DA6FF] text-white border-0"
                    : ""
                }`}
              >
                {item.name}
              </a>
            </li>
          ))}
          <Button
            onClick={() => setAddNotesModalOpen(true)}
            sx={{
              padding: "10px",
              bgcolor: "#eee",
              borderRadius: "10px",
              ":hover": { bgcolor: "#ddd" },
            }}
          >
            <FaPlus className="text-2xl text-[#000]" />
          </Button>
        </ul>

        {/* Login / Logout Button */}
        <div className="other-nav">
          {isAuthorized ? (
            <Button
              id="basic-button"
              aria-controls={isMenuOpen ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={isMenuOpen ? "true" : undefined}
              onClick={handleMenuClick}
              sx={{
                px: 3,
                py: 1,
                display: "flex",
                textTransform: "capitalize",
                gap: "10px",
                borderRadius: "10px",
                backgroundColor: "#FFD27D",
                color: "#645f5D",
                "&:hover": {
                  backgroundColor: "#eee",
                },
              }}
            >
              <RiSettingsLine />
              <p>Setting</p>
            </Button>
          ) : (
            <button
              onClick={() => {
                setSignInModalOpen(true);
              }}
              className="nav-link bg-[#0A66C2] text-white px-5 py-2 rounded-[10px] flex items-center gap-3 duration-300"
            >
              <IoLogIn />
              <p className="font-medium text-white">Login</p>
            </button>
          )}

          {/* Dropdown Menu for Authorized User */}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleMenuProfile}>My account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </nav>

      {/* Modals */}
      <ModalSignIn
        isOpen={isSignInModalOpen}
        onClose={() => setSignInModalOpen(false)}
        onAuthorized={handleAutrorized}
      />
      <ModalAddNotes
        isOpen={isAddNotesModalOpen}
        onClose={() => setAddNotesModalOpen(false)}
      />
    </>
  );
}
