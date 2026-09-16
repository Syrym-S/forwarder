import FormControllerInput from "../../../shared/ui/input/form-controller-input";
import { StepSection } from "../step-section";
import { Box } from "@mui/material";

const PriceStep = ({ control }) => {
  return (
    <StepSection title="Укажите вашу маржу">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
          },
          gap: 2,
        }}
      >
        <FormControllerInput
          name="price"
          control={control}
          label="Цена заказчика"
          size="small"
          fullWidth
        />

        <FormControllerInput
          name="transportation_price"
          control={control}
          label="Ваша цена за перевозку"
          size="small"
          fullWidth
        />
      </Box>
    </StepSection>
  );
};

export default PriceStep;
