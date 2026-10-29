import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PrimaryButton from "../../shared/ui/button/primary-button";
import FormInput from "../../shared/ui/input/form-input";
import { deleteProfileApi } from "../../app/store/profile/api";
import { isStaging } from "../../app/client";

const DeleteAccountBlock = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const submitting = useRef(false);

  const handleClose = () => {
    if (submitting.current) return;
    setOpen(false);
    setPassword("");
    setError("");
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    if (!password || submitting.current) return;
    submitting.current = true;
    setIsLoading(true);
    setError("");

    try {
      await deleteProfileApi(password);
    } catch (requestError) {
      const status = requestError.response?.status;
      const message = requestError.response?.data?.message;
      if (status === 403 && message === "Invalid password") {
        setError(t("ui.incorrect_password_retry"));
      } else if (status === 409 && message === "User has an active lead") {
        setError(t("ui.account_delete_active_lead"));
      } else if (status === 409 && message === "User has an active factoring") {
        setError(t("ui.account_delete_active_factoring"));
      } else {
        setError(t("ui.account_delete_failed"));
      }
      submitting.current = false;
      setIsLoading(false);
      return;
    }

    setPassword("");
    window.location.replace(isStaging ? "/staging/auth/login" : "/auth/login");
  };

  return (
    <>
      <Paper
        variant="outlined"
        sx={{ mt: 3, p: { xs: 2, sm: 3 }, borderRadius: 5 }}
      >
        <Stack spacing={2} alignItems="flex-start">
          <Typography fontWeight={600} fontSize="1.1rem">{t("ui.account_deletion")}</Typography>
          <PrimaryButton
            text={t("ui.delete_account")}
            error
            variant="outlined"
            startIcon={<DeleteOutlineRoundedIcon />}
            onClick={() => setOpen(true)}
            sx={{
              width: "fit-content",
            }}
          />
          <Typography color="text.secondary" fontSize={14}>{t("ui.account_deletion_hint")}</Typography>
        </Stack>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        aria-labelledby="delete-account-title"
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <form onSubmit={handleDelete}>
          <DialogTitle id="delete-account-title">{t("ui.delete_account_question")}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Typography color="text.secondary" fontSize={14}>{t("ui.confirm_account_deletion_hint")}</Typography>
              <FormInput
                id="delete-account-password"
                label={t("ui.current_password")}
                type="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                size="small"
                value={password}
                disabled={isLoading}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
              />
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <PrimaryButton
              text={t("ui.cancel")}
              variant="outlined"
              size="medium"
              disabled={isLoading}
              onClick={handleClose}
            />
            <PrimaryButton
              text={t("ui.delete_account")}
              type="submit"
              error
              size="medium"
              isLoading={isLoading}
              disabled={!password}
            />
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default DeleteAccountBlock;
