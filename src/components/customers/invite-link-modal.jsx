import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

function InviteLinkModal({ inviteLink, clearInviteLink }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Dialog
        open={inviteLink}
        onClose={clearInviteLink}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t("ui.invitation_link")}</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            value={inviteLink}
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            onClick={handleCopy}
            sx={{
              "& .MuiInputBase-input": {
                cursor: "pointer",
              },
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={clearInviteLink}>{t("ui.close")}</Button>
          <Button variant="contained" onClick={handleCopy}>{t("ui.copy")}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setCopied(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >{t("ui.link_copied")}</Alert>
      </Snackbar>
    </>
  );
}

export default InviteLinkModal;
