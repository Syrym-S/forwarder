import { useTranslation } from "react-i18next";
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
  title,
  text,
}) => {
  const { t } = useTranslation();
  const isApproveLoading = useFactoringStore((state) => state.isApproveLoading);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title ?? t("ui.confirmation")}</DialogTitle>

      <DialogContent>
        <Typography>{text ?? t("ui.confirm_action_question")}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t("ui.cancel")}</Button>

        <Button variant="contained" onClick={onConfirm}>
          {isApproveLoading ? t("ui.confirmation_in_progress") : t("ui.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
