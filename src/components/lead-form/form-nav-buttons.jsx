import { Box, Button, DialogActions } from "@mui/material";
import PropTypes from "prop-types";

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
        px: 3,
        pb: 3,
        pt: 2,
        justifyContent: "space-between",
      }}
    >
      <Button type="button" onClick={onClose} disabled={isSubmitting}>
        Отмена
      </Button>

      <Box sx={{ display: "flex", gap: 1 }}>
        {!isFirstStep && (
          <Button type="button" onClick={onBack} disabled={isSubmitting}>
            Назад
          </Button>
        )}

        {isLastStep ? (
          <Button
            type="button"
            variant="contained"
            disabled={isSubmitting || hasCurrentStepErrors}
            onClick={onSubmit}
          >
            {isEdit ? "Сохранить" : "Создать маршрут"}
          </Button>
        ) : (
          <Button
            type="button"
            variant="contained"
            disabled={hasCurrentStepErrors || isSubmitting}
            onClick={onNext}
          >
            Дальше
          </Button>
        )}
      </Box>
    </DialogActions>
  );
}
