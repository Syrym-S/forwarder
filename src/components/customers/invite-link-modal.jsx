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
        <DialogTitle>Ссылка-приглашение</DialogTitle>

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
          <Button onClick={clearInviteLink}>Закрыть</Button>
          <Button variant="contained" onClick={handleCopy}>
            Копировать
          </Button>
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
        >
          Ссылка скопирована
        </Alert>
      </Snackbar>
    </>
  );
}

export default InviteLinkModal;
