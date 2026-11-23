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
      disableSpacing
      sx={{
        p: { xs: 1.5, sm: 2 },
        px: { sm: 3 },
        flexShrink: 0,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column-reverse", sm: "row" },
        gap: 1,
        "& .MuiButton-root": { minHeight: 40, minWidth: 0, fontSize: 13, px: 1.5, lineHeight: 1.3, whiteSpace: "normal" },
        "@media (max-height: 500px)": { p: 1, "& .MuiButton-root": { minHeight: 32, fontSize: 12 } },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, minWidth: 0 }}>
        <PrimaryButton
          size="small"
          variant="text"
          onClick={onClose}
          disabled={isSubmitting}
          text={t("ui.cancel")}
        />
        {onSaveDraft && (
          <PrimaryButton
            size="small"
            variant="text"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            text={t("lead_form.save_as_draft")}
          />
        )}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: isFirstStep ? "minmax(0, 1fr)" : "minmax(0, .65fr) minmax(0, 1fr)", gap: 1, minWidth: 0, width: { xs: "100%", sm: "auto" } }}>
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
