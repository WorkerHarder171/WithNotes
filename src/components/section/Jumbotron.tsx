import { Button } from "@mui/material";
import { useState } from "react";
import ModalSignIn from "@/components/modals/sign-in/ModalSignIn";
import pp from "@/assets/notes.png";
export default function Jumbotron(): JSX.Element {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      <div className="relative bg-[#fff] rounded-[10px] h-[78vh]">
        {/* Content */}
        <div className="flex justify-center items-center h-full relative z-30 p-16">
          <div className="wrapper">
            <p className="text-7xl capitalize max-w-[800px] text-left tracking-wider">
              Write your day, organize your life.
            </p>
            <p className="desc text-xl tracking-widest my-10 max-w-2xl text-left">
              An organized life begins with scheduling every moment for
              effective time management.
            </p>
            <Button
              variant="contained"
              onClick={() => setOpenModal(true)}
              sx={{
                marginTop: "30px",
                fontSize: "1.2rem",
                textTransform: "capitalize",
              }}
            >
              Get Started
            </Button>
          </div>
          <div className="wrapper-img">
            <img src={pp} alt="" className="h-[400px] object-cover" />
          </div>
        </div>
      </div>

      {/* Modal Sign-In */}
      <ModalSignIn
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onAuthorized={() => {
          console.log("authorized");
        }}
      />
    </>
  );
}
