import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const ConfirmModal = ({
  open,
  title = "Подтверждение",
  description,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          disabled={isLoading}
          onClick={onCancel}
          variant="outlined"
          color="error"
        >
          Отмена
        </Button>
        <Button
          disabled={isLoading}
          onClick={onConfirm}
          variant="contained"
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          {isLoading && (
            <CircularProgress
              size={13}
              sx={{
                color: "white",
              }}
            />
          )}
          {isLoading ? "Подтверждение" : "Подтвердить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmModal;
