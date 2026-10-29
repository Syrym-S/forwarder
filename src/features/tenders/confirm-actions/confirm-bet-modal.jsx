import { useTranslation } from "react-i18next";
import { moneySpacingFormat } from "../../../shared/helpers/money-spacing";
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
  const { t } = useTranslation();
  const isLoading = useTendersStore((state) => state.isLoading);

  return (
    <Dialog open={openConfirmModal} maxWidth="sm" fullWidth>
      <DialogTitle>{t("ui.place_bid_2")}</DialogTitle>
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
          <Typography>{t("ui.confirm_auction_bid")}</Typography>
          <Typography>{t("ui.amount_value", { value1: moneySpacingFormat(formValues.amount), value2: formValues.currency })}</Typography>
        </DialogContent>
      )}
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          onClick={handleCloseConfirmModal}
          disabled={isLoading}
        >{t("ui.cancel_2")}</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={submitBetForm}
          disabled={isLoading}
        >{t("ui.place_bid")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmBetModal;
