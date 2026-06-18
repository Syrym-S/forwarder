import { StepSection } from "../step-section";
import { Box, TextField } from "@mui/material";

const PriceStep = () => {
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
        <TextField
          label="Цена заказщика (price)"
          size="small"
          disabled
          fullWidth
          value={"5000 KZT"}
        />
        <TextField
          label="Ваша цена за перевозку (trancportation_price)"
          size="small"
          fullWidth
        />
      </Box>
    </StepSection>
  );
};

export default PriceStep;
