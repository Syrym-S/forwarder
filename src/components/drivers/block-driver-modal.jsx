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
      setError(e.response?.data?.message || "Не удалось заблокировать водителя");
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
      <DialogTitle id={blockModalTitleId}>Заблокировать водителя</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {driver?.fio}
        </Typography>
        <TextField
          required
          disabled={isSubmitting}
          helperText="Комментарий обязателен"
          autoFocus
          fullWidth
          multiline
          minRows={3}
          margin="dense"
          label="Комментарий"
          placeholder="Укажите причину блокировки"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>Отмена</Button>

        <Button onClick={handleConfirm} disabled={!comment.trim() || isSubmitting}>
          Заблокировать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockDriverModal;
