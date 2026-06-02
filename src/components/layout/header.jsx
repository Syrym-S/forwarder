import { useState } from "react";
import LogoutModal from "./logout-modal";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./style.css";
import Profile from "./profile";
import Box from "@mui/material/Box";
import { AppBar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = ({ openMenu, setOpenMenu }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();

  const handleOpenProfile = () => {
    setOpenProfile(true);
    navigate("/profile");
  };
  const handleCloseProfile = () => {
    setOpenProfile(false);
  };
  const handleToggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  return (
    <AppBar
      position="sticky"
      display="flex"
      sx={{
        top: 0,
        left: 0,
        height: "10vh",
        color: "#000000",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        backgroundColor: "background.default",
        zIndex: 2,
      }}
    >
      <MenuIcon
        sx={{
          transform: openMenu ? "rotate(90deg)" : "rotate(0)",
          transition: "0.2s",
          fontSize: "2rem",
          visibility: {
            xs: "visible",
            sm: "hidden",
          },
        }}
        onClick={handleToggleMenu}
      />

      <Box
        sx={{
          position: "relative",
        }}
      >
        <AccountCircleIcon
          sx={{
            color: "#333",
            fontSize: "2rem",
          }}
          onClick={handleOpenProfile}
        />
        <></>
        <Profile open={openProfile} handleCloseProfile={handleCloseProfile} />
      </Box>
    </AppBar>
  );
};

export default Header;
