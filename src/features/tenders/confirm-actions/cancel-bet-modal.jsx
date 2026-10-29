import { useTranslation } from "react-i18next";
import { moneySpacingFormat } from "../../../shared/helpers/money-spacing";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";

const CancelBetModal = ({
  bet,
  openCancelModal,
  handleCloseCancelModal,
  confirmCancel,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={openCancelModal} maxWidth="sm" fullWidth>
      <DialogTitle>{t("ui.cancel_bid")}</DialogTitle>
      <DialogContent>
        <Typography>{t("ui.cancel_bid_confirmation")}</Typography>
        <Typography>{t("ui.bid_amount_value", { value1: moneySpacingFormat(bet.amount), value2: bet.currency })}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleCloseCancelModal}
        >{t("ui.back_2")}</Button>
        <Button variant="contained" color="error" onClick={confirmCancel}>{t("ui.yes_cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelBetModal;
