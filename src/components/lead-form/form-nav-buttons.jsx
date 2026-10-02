import { Box, DialogActions } from "@mui/material";
import PrimaryButton from "../../shared/ui/button/primary-button";

export function FormNavButtons({
  isEdit,
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
        text={"Отмена"}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {!isEdit && onSaveDraft && (
          <PrimaryButton
            variant="outlined"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            text="Сохранить как черновик"
          />
        )}
        {!isFirstStep && (
          <PrimaryButton
            variant="outlined"
            onClick={onBack}
            disabled={isSubmitting}
            text={"Назад"}
          />
        )}

        {isLastStep ? (
          <PrimaryButton
            variant="contained"
            disabled={isSubmitting || hasCurrentStepErrors}
            onClick={onSubmit}
            text={isEdit ? "Сохранить" : "Создать маршрут"}
          />
        ) : (
          <PrimaryButton
            variant="contained"
            disabled={hasCurrentStepErrors || isSubmitting}
            onClick={onNext}
            text={"Дальше"}
          />
        )}
      </Box>
    </DialogActions>
  );
}
