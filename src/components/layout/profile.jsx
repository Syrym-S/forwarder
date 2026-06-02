import Box from "@mui/material/Box";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import LogoutIcon from "@mui/icons-material/Logout";
import LogoutModal from "./logout-modal";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useState } from "react";
import { Fade, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "black",
            }}
          >
            USER INFO
          </Box>

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
          <LogoutModal open={openModal} handleOpenModal={handleOpenModal} />
        </Box>
      </Fade>
    </Box>
  );
};

export default Profile;
