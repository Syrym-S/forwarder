import { useTranslation } from "react-i18next";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { api, isStaging } from "../../app/client";
import { unregisterPushBeforeLogout } from "../../app/store/notifications/web-push-store";

const LogoutModal = ({ open, handleOpenModal, handleCloseProfile }) => {
  const { t } = useTranslation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState(false);
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setError(false);
    try {
      await unregisterPushBeforeLogout();
      await api.post("/auth/v1/logout", null, {
        headers: { "X-WP-Nonce": window.APP_DATA?.nonce || "" },
      });
      window.location.replace(isStaging ? "/staging/auth/login" : "/auth/login");
    } catch {
      setError(true);
      setIsLoggingOut(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>{t("ui.logout_confirmation_question")}</DialogTitle>
      {error && <Alert severity="error">{t("webPush.logoutFailed")}</Alert>}
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
          disabled={isLoggingOut}
          onClick={handleLogout}
        >
          {t("ui.logout")}
        </Button>
        <Button
          onClick={() => { handleOpenModal(); handleCloseProfile(); }}
          sx={{
            fontSize: "1rem",
          }}
          color="error"
          variant="outlined"
          disabled={isLoggingOut}
        >{t("ui.cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutModal;
