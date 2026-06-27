import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";
import { useTendersStore } from "../../../app/store/tenders/tender-store";

const ConfirmBetModal = ({
  openConfirmModal,
  formValues,
  submitBetForm,
  handleCloseConfirmModal,
}) => {
  const isLoading = useTendersStore((state) => state.isLoading);

  return (
    <Dialog open={openConfirmModal} maxWidth="sm" fullWidth>
      <DialogTitle>Поставить ставку</DialogTitle>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            height: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={30} />
        </Box>
      ) : (
        <DialogContent>
          <Typography>
            Вы уверены что хотите сделать ставку на этот тендер?
          </Typography>
          <Typography>
            Сумма: {formValues.amount} {formValues.currency}
          </Typography>
        </DialogContent>
      )}
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          onClick={handleCloseConfirmModal}
          disabled={isLoading}
        >
          Отменить
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={submitBetForm}
          disabled={isLoading}
        >
          Сделать ставку
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmBetModal;
