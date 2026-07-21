import { Controller } from "react-hook-form";
import { StepSection } from "../step-section";
import { Box, TextField } from "@mui/material";

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
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Цена заказщика"
              size="small"
              fullWidth
            />
          )}
        />
        <Controller
          name="transportation_price"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Ваша цена за перевозку (trancportation_price)"
              size="small"
              fullWidth
            />
          )}
        />
      </Box>
    </StepSection>
  );
};

export default PriceStep;
