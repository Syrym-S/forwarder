import { useTranslation } from "react-i18next";
import { Box, DialogActions } from "@mui/material";
import PrimaryButton from "../../shared/ui/button/primary-button";

export function FormNavButtons({
  isEdit,
  isDraft = false,
  isFirstStep,
  isLastStep,
  hasCurrentStepErrors,
  isSubmitting,
  onClose,
  onBack,
  onNext,
  onSubmit,
  onSaveDraft,
}) {
  const { t } = useTranslation();
  return (
    <DialogActions
      sx={{
        pb: 3,
        pt: 2,
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      <PrimaryButton
        variant="outlined"
        onClick={onClose}
        disabled={isSubmitting}
        text={t("ui.cancel")}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {onSaveDraft && (
          <PrimaryButton
            variant="outlined"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            text={t("lead_form.save_as_draft")}
          />
        )}
        {!isFirstStep && (
          <PrimaryButton
            variant="outlined"
            onClick={onBack}
            disabled={isSubmitting}
            text={t("ui.back")}
          />
        )}

        {isLastStep ? (
          <PrimaryButton
            variant="contained"
            disabled={isSubmitting || hasCurrentStepErrors}
            onClick={onSubmit}
            text={isDraft ? t("lead_form.publish") : isEdit ? t("ui.save") : t("lead_form.create_route")}
          />
        ) : (
          <PrimaryButton
            variant="contained"
            disabled={hasCurrentStepErrors || isSubmitting}
            onClick={onNext}
            text={t("ui.next")}
          />
        )}
      </Box>
    </DialogActions>
  );
}
