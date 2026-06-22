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
  return (
    <Dialog open={openCancelModal} maxWidth="sm" fullWidth>
      <DialogTitle>Отменить ставку</DialogTitle>
      <DialogContent>
        <Typography>
          Вы уверены что хотите отменить ставку на этот тендер?
        </Typography>
        <Typography>
          Сумма ставки: {bet.amount} {bet.currency}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleCloseCancelModal}
        >
          Нет назад
        </Button>
        <Button variant="contained" color="error" onClick={confirmCancel}>
          Да отменить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelBetModal;
