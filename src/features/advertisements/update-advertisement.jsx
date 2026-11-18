import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { useAdvertisementsStore } from "../../app/store/advertisements/advertisements-store";
import ChooseExistingLeadStep from "../../components/advertisements/choose-existing-lead-step";
import PrimaryButton from "../../shared/ui/button/primary-button";

const UpdateAdvertisement = ({ advertisement, open, onClose }) => {
  const { t } = useTranslation();
  const [selectedLead, setSelectedLead] = useState(advertisement.lead || null);
  const [showSuccess, setShowSuccess] = useState(false);
  const isUpdating = useAdvertisementsStore((state) => state.isUpdating);
  const error = useAdvertisementsStore((state) => state.updateError);
  const updateAdvertisement = useAdvertisementsStore((state) => state.updateAdvertisement);
  const clearUpdateError = useAdvertisementsStore((state) => state.clearUpdateError);

  const handleClose = () => {
    if (isUpdating) return;
    clearUpdateError();
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedLead?.id || isUpdating) return;
    try {
      const result = await updateAdvertisement(advertisement.id, selectedLead.id);
      if (result === false) return;
      setShowSuccess(true);
      onClose();
    } catch {
      // The store keeps the request error so the selection can be retried.
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        disableEscapeKeyDown={isUpdating}
        maxWidth="sm"
        fullWidth
        aria-labelledby="update-advertisement-title"
        slotProps={{
          paper: { sx: { borderRadius: 3 } },
          transition: {
            onEnter: () => {
              setSelectedLead(advertisement.lead || null);
              clearUpdateError();
            },
          },
        }}
      >
        <DialogTitle id="update-advertisement-title">
          {t("advertisements.edit")}
        </DialogTitle>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {typeof error === "string" ? error : t("advertisements.update_error")}
            </Alert>
          )}
          <ChooseExistingLeadStep
            lead={selectedLead}
            disabled={isUpdating}
            onChange={(lead) => {
              setSelectedLead(lead);
              clearUpdateError();
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button disabled={isUpdating} onClick={handleClose}>
            {t("ui.cancel")}
          </Button>
          <PrimaryButton
            text={isUpdating ? t("ui.saving") : t("ui.save_changes")}
            isLoading={isUpdating}
            disabled={!selectedLead?.id}
            onClick={handleSubmit}
          />
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setShowSuccess(false)}>
          {t("advertisements.updated_success")}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UpdateAdvertisement;
