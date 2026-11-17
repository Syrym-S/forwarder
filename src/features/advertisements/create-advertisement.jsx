import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import TooltipIconButton from "../../shared/ui/tooltip-icon-button";
import PrimaryButton from "../../shared/ui/button/primary-button";
import { STEPS } from "../../shared/const/steps";
import { useFormDefaultValues } from "../../shared/hooks/leads/use-form-default-values";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import MainStep from "../../components/advertisements/main-step";
import ChooseExistingLeadStep from "../../components/advertisements/choose-existing-lead-step";
import AddLeadForm from "../leads/add-lead-form";
import { useAdvertisementsStore } from "../../app/store/advertisements/advertisements-store";

const CreateAdvertisement = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(STEPS.main_step);
  const [selectedLead, setSelectedLead] = useState(null);
  const [createdLeadId, setCreatedLeadId] = useState(null);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const isSubmitting = useAdvertisementsStore((state) => state.isCreating);
  const createError = useAdvertisementsStore((state) => state.createError);
  const createAdvertisement = useAdvertisementsStore((state) => state.createAdvertisement);
  const clearCreateError = useAdvertisementsStore((state) => state.clearCreateError);
  const clearCurrentLead = useLeadsStore((state) => state.clearCurrentLead);
  const initialValues = useFormDefaultValues();
  const leadId = createdLeadId || selectedLead?.id;
  const errorMessage = error || (createError
    ? typeof createError === "string" ? createError : t("advertisements.create_error")
    : null);

  const clearError = () => {
    setError(null);
    clearCreateError();
  };

  const resetForm = () => {
    setStep(STEPS.main_step);
    setSelectedLead(null);
    setCreatedLeadId(null);
    setIsLeadFormOpen(false);
    clearError();
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  const nextStep = (nextStepValue) => {
    clearError();
    setCreatedLeadId(null);
    if (nextStepValue === STEPS.create_new) {
      clearCurrentLead();
      setIsLeadFormOpen(true);
      return;
    }
    setStep(nextStepValue);
  };

  const submitAdvertisement = async (lead_id) => {
    if (!lead_id || isSubmitting) return;
    clearError();
    try {
      const created = await createAdvertisement(lead_id);
      if (!created) return;
      setShowSuccess(true);
      onClose();
    } catch {
      // Ошибка запроса хранится в advertisements-store.
    }
  };

  const handleLeadSaved = ({ isDraft, lead_id }) => {
    setIsLeadFormOpen(false);
    if (isDraft) {
      resetForm();
      onClose();
      return;
    }
    setSelectedLead(null);
    setCreatedLeadId(lead_id || null);
    setStep(STEPS.use_exists);
    if (!lead_id) {
      setError(t("advertisements.lead_id_missing"));
      return;
    }
    void submitAdvertisement(lead_id);
  };

  const renderContent = () => {
    if (step === STEPS.main_step) return <MainStep nextStep={nextStep} />;
    if (step === STEPS.use_exists) {
      return createdLeadId ? (
        <Alert severity="info">{t("lead_form.lead_created")}: {createdLeadId}</Alert>
      ) : (
        <ChooseExistingLeadStep
          lead={selectedLead}
          disabled={isSubmitting}
          onChange={(lead) => {
            setSelectedLead(lead);
            clearError();
          }}
        />
      );
    }
    return null;
  };

  return (
    <>
      <Dialog
        open={open && !isLeadFormOpen}
        onClose={handleClose}
        disableEscapeKeyDown={isSubmitting}
        maxWidth="sm"
        fullWidth
        aria-labelledby="create-advertisement-title"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              height: "min(560px, calc(100dvh - 64px))",
            },
          },
          transition: {
            onExited: () => {
              if (!open) resetForm();
            },
          },
        }}
      >
        <DialogTitle
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            p: { xs: 2, sm: 3 },
          }}
        >
          {step !== STEPS.main_step && (
            <TooltipIconButton
              title={t("ui.back")}
              aria-label={t("ui.back")}
              disabled={isSubmitting}
              onClick={() => {
                setStep(STEPS.main_step);
                clearError();
              }}
              sx={{ flexShrink: 0 }}
            >
              <ArrowBackRoundedIcon
                sx={{
                  transform: (theme) =>
                    theme.direction === "rtl" ? "rotate(180deg)" : "none",
                }}
              />
            </TooltipIconButton>
          )}
          <Typography
            id="create-advertisement-title"
            component="h2"
            sx={{ flex: 1, fontSize: 20, fontWeight: 600, color: "font_color.heading" }}
          >
            {t("advertisements.create")}
          </Typography>
          <TooltipIconButton
            title={t("ui.close")}
            aria-label={t("ui.close")}
            disabled={isSubmitting}
            onClick={handleClose}
            sx={{ flexShrink: 0 }}
          >
            <CloseRoundedIcon />
          </TooltipIconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{ p: { xs: 2, sm: 3 }, scrollbarGutter: "stable" }}
        >
          {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
          {renderContent()}
        </DialogContent>

        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, minHeight: 76, flexShrink: 0 }}>
          {step === STEPS.use_exists && (
            <PrimaryButton
              text={isSubmitting ? t("ui.creating") : t("advertisements.create")}
              isLoading={isSubmitting}
              disabled={!leadId}
              onClick={() => submitAdvertisement(leadId)}
            />
          )}
        </DialogActions>
      </Dialog>

      {isLeadFormOpen && (
        <AddLeadForm
          withoutDriver
          openForm={isLeadFormOpen}
          setOpenForm={setIsLeadFormOpen}
          initialValues={initialValues}
          onSaved={handleLeadSaved}
        />
      )}

      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setShowSuccess(false)}>
          {t("advertisements.created_success")}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateAdvertisement;
