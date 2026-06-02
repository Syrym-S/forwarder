import React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const LogoutModal = ({ open, handleOpenModal }) => {
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
          Выйти
        </Button>
        <Button
          onClick={handleOpenModal}
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
