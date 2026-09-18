import { Box, Button, DialogActions } from "@mui/material";
import PropTypes from "prop-types";
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
}) {
  return (
    <DialogActions
      sx={{
        pb: 3,
        pt: 2,
        justifyContent: "space-between",
      }}
    >
      <PrimaryButton
        variant="outlined"
        onClick={onClose}
        disabled={isSubmitting}
        text={"Отмена"}
      />

      <Box sx={{ display: "flex", gap: 1 }}>
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
