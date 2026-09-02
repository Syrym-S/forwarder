import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useFactoringStore } from "../../app/store/factoring/factoring-store";

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = "Подтверждение",
  text = "Вы уверены, что хотите подтвердить действие?",
}) => {
  const isApproveLoading = useFactoringStore((state) => state.isApproveLoading);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Typography>{text}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>

        <Button variant="contained" onClick={onConfirm}>
          {isApproveLoading ? "...Подтверждение" : "Подтвердить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
