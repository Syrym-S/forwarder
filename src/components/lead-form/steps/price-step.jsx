import { useTranslation } from "react-i18next";
import FormControllerInput from "../../../shared/ui/input/form-controller-input";
import { StepSection } from "../step-section";
import { Box } from "@mui/material";

const PriceStep = ({ control }) => {
  const { t } = useTranslation();
  return (
    <StepSection title={t("lead_form.enter_your_margin")}>
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
          type="number"
          slotProps={{ htmlInput: { min: 0, step: "any" } }}
          control={control}
          label={t("ui.customer_price")}
          size="small"
          fullWidth
        />

        <FormControllerInput
          name="transportation_price"
          type="number"
          slotProps={{ htmlInput: { min: 0, step: "any" } }}
          control={control}
          label={t("ui.your_lead_price")}
          size="small"
          fullWidth
        />
      </Box>
    </StepSection>
  );
};

export default PriceStep;
