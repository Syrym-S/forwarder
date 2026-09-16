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
      <Button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        sx={{
          borderRadius: 2,
        }}
      >
        Отмена
      </Button>

      <Box sx={{ display: "flex", gap: 1 }}>
        {!isFirstStep && (
          <Button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            sx={{
              borderRadius: 2,
            }}
          >
            Назад
          </Button>
        )}

        {isLastStep ? (
          <Button
            type="button"
            variant="contained"
            disabled={isSubmitting || hasCurrentStepErrors}
            onClick={onSubmit}
            sx={{
              borderRadius: 2,
            }}
          >
            {isEdit ? "Сохранить" : "Создать маршрут"}
          </Button>
        ) : (
          <Button
            type="button"
            variant="contained"
            disabled={hasCurrentStepErrors || isSubmitting}
            onClick={onNext}
            sx={{
              borderRadius: 2,
            }}
          >
            Дальше
          </Button>
        )}
      </Box>
    </DialogActions>
  );
}
