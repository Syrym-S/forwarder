import { useTranslation } from "react-i18next";
import { useId, useState } from "react";
import {
  Button,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

const BlockDriverModal = ({ driver, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const blockModalTitleId = useId();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    const trimmedComment = comment.trim();
    if (!trimmedComment || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(driver.id, trimmedComment);
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || t("ui.block_driver_failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={isSubmitting ? undefined : onClose}
      aria-labelledby={blockModalTitleId}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id={blockModalTitleId}>{t("ui.block_driver")}</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {driver?.fio}
        </Typography>
        <TextField
          required
          disabled={isSubmitting}
          helperText={t("ui.comment_required")}
          autoFocus
          fullWidth
          multiline
          minRows={3}
          margin="dense"
          label={t("ui.comment")}
          placeholder={t("ui.enter_block_reason")}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>{t("ui.cancel")}</Button>

        <Button onClick={handleConfirm} disabled={!comment.trim() || isSubmitting}>{t("ui.block")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockDriverModal;
