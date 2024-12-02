import { useState, useEffect } from "react";
import { RiSettingsLine } from "react-icons/ri";
import { IoLogIn } from "react-icons/io5";
import { authService } from "@/config/auth";
import { Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/config/supabase/supabaseClient";
import pp from "@/assets/pp.jpg";
import ModalSignIn from "@/components/modals/sign-in/ModalSignIn";

export default function Navbar(): JSX.Element {
  // get State
  const [user, setUser] = useState<{ username: string } | null>(null);
  // check if user is authorized
  const [isAuthorized, setIsAuthorized] = useState<boolean>(
    authService.isAuthorized()
  );

  const navigate = useNavigate();
  
  // default path
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.hash.substring(1) || "all"
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  
  // open modal
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = (): void => setOpenModal(true);
  const handleCloseModal = (): void => setOpenModal(false);

// get user data
  const getUser = async (): Promise<void> => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Error fetching user data:", authError.message);
      return;
    }

    if (user) {
      const { data, error } = await supabase
        .from("user")
        .select("username")
        .eq("email", user.email)
        .single();

      if (error) {
        console.error("Error fetching user data:", error.message);
      } else {
        setUser(data);
      }
    }
  };

  // handle menu click
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuProfile = () => {
    navigate("/profile");
  };

  const handleLogout = async () => {
    await authService.logout();
    setAnchorEl(null);
    setIsAuthorized(false);
    setUser(null);
    navigate("/");
  };

// render user data
  useEffect(() => {
    if (!isAuthorized) {
      console.log("User is unauthorized");
    }
    getUser();

    const handleHashChange = () => {
      setCurrentPath(window.location.hash.substring(1) || "all");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [isAuthorized]);

  const navItems: { name: string; link: string }[] = [
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
          className={`nav-brand flex items-center gap-5 ${
            isAuthorized ? "" : "hidden"
          }`}
        >
          <img
            className="rounded-full object-cover w-[50px] h-[50px]"
            src={pp}
            alt="Profile"
          />
          <p className="name-profile font-medium text-xl">{user ? user.username : ""}</p>
        </div>

        {/* Navigation Links */}
        <ul className="nav navbar w-[40%] flex justify-evenly">
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
              onClick={handleOpenModal}
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
            <MenuItem onClick={handleMenuProfile}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </nav>

      {/* Modal for Sign In */}
      <ModalSignIn isOpen={openModal} onClose={handleCloseModal} />
    </>
  );
}
