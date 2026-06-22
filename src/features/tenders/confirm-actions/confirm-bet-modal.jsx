import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";

const ConfirmBetModal = ({
  openConfirmModal,
  formValues,
  submitBetForm,
  handleCloseConfirmModal,
}) => {
  return (
    <Dialog open={openConfirmModal} maxWidth="sm" fullWidth>
      <DialogTitle>Поставить ставку</DialogTitle>
      <DialogContent>
        <Typography>
          Вы уверены что хотите сделать ставку на этот тендер?
        </Typography>
        <Typography>
          Сумма: {formValues.amount} {formValues.currency}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          onClick={handleCloseConfirmModal}
        >
          Отменить
        </Button>
        <Button variant="contained" color="primary" onClick={submitBetForm}>
          Сделать ставку
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmBetModal;
