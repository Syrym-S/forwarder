import React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { NavLink, useNavigation } from "react-router-dom";

const LogoutModal = ({ open, handleOpenModal, handleCloseProfile }) => {
  const handleLogout = () => {
    handleOpenModal();
    handleCloseProfile();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Вы уверены, что хотите выйти?</DialogTitle>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-around",
          gap: "10px",
        }}
      >
        <Button
          sx={{
            fontSize: "1rem",
          }}
          variant="contained"
        >
          <NavLink
            style={{
              textDecoration: "none",
              color: "white",
            }}
            onClick={handleLogout}
            to={"/auth"}
          >
            Выйти
          </NavLink>
        </Button>
        <Button
          onClick={handleLogout}
          sx={{
            fontSize: "1rem",
          }}
          color="error"
          variant="outlined"
        >
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutModal;
