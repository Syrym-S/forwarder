import { Box, Button, DialogActions, Stack } from "@mui/material";

const LeadFormActions = ({
  activeStep,
  steps,
  nexpStep,
  previousStep,
  handleCloseForm,
}) => {
  const isLastStep = steps.length === activeStep;
  const isFirstStep = activeStep === 1;

  return (
    <DialogActions
      sx={{
        px: 3,
        pb: 3,
        pt: 2,
        justifyContent: "space-between",
      }}
    >
      <Button onClick={handleCloseForm}>Отмена</Button>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button onClick={previousStep} disabled={isFirstStep}>
          Назад
        </Button>
        {isLastStep ? (
          <Button>Сохранить</Button>
        ) : (
          <Button onClick={nexpStep} disabled={isLastStep}>
            Далее
          </Button>
        )}
      </Box>
    </DialogActions>
  );
};

export default LeadFormActions;
