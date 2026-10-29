import { useTranslation } from "react-i18next";
import React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import { api, isStaging } from "../../app/client";

const LogoutModal = ({ open, handleOpenModal, handleCloseProfile }) => {
  const { t } = useTranslation();
  const handleLogout = async () => {
    handleOpenModal();
    handleCloseProfile();

    await api.post("/auth/v1/logout");
    window.location.replace(isStaging ? "/staging/auth/login" : "/auth/login");
  };

  return (
    <Dialog open={open}>
      <DialogTitle>{t("ui.logout_confirmation_question")}</DialogTitle>
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
          >{t("ui.logout")}</NavLink>
        </Button>
        <Button
          onClick={handleLogout}
          sx={{
            fontSize: "1rem",
          }}
          color="error"
          variant="outlined"
        >{t("ui.cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutModal;
