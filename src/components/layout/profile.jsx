import Box from "@mui/material/Box";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import LogoutIcon from "@mui/icons-material/Logout";
import LogoutModal from "./logout-modal";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useState } from "react";
import { Fade, IconButton, Stack, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { Person2Rounded } from "@mui/icons-material";
import CustomNavLink from "../../shared/ui/custom-nav-link";

const Profile = ({ open, handleCloseProfile }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal((prev) => !prev);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Fade in={open} mountOnEnter unmountOnExit>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 1,
            boxShadow: 3,
            backgroundColor: "white",
            width: "200px",
            height: "300px",
            padding: "10px",
            position: "absolute",
            top: "100%",
            right: 10,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "black",
              p: "0 5px",
            }}
          >
            <Typography>User Name</Typography>
            <IconButton
              sx={{
                p: 0,
              }}
              onClick={handleCloseProfile}
              variant="outlined"
              color="error"
            >
              <HighlightOffIcon />
            </IconButton>
          </Box>

          <Stack
            sx={{
              height: "100%",
              display: "flex",
              paddingTop: "10px",
            }}
          >
            <Typography
              sx={{
                display: "flex",
                gap: "10px",
              }}
            >
              <Person2Rounded />
              {/* <NavLink to={"/profile"}>Profile</NavLink>\ */}
              <CustomNavLink
                path={"/profile"}
                label="Profile"
                color="black"
                variant="contained"
              />
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              cursor: "pointer",
            }}
            onClick={handleOpenModal}
          >
            <Typography
              sx={{
                fontSize: "13px",
              }}
            >
              Выйти из аккаунта
            </Typography>
            <LogoutIcon color="error" />
          </Box>
          <LogoutModal
            open={openModal}
            handleOpenModal={handleOpenModal}
            handleCloseProfile={handleCloseProfile}
          />
        </Box>
      </Fade>
    </Box>
  );
};

export default Profile;
