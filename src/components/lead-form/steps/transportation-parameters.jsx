import { Box } from "@mui/material";
import { Controller } from "react-hook-form";
import { transportationParameters } from "../../../shared/const/leads/transportation-parameters";
import CustomSelect from "../../../shared/ui/input/custom-select";
import { StepSection } from "../step-section";

export default function TransportationParameters({ control, options = {} }) {
  return (
    <StepSection title="Параметры перевозки">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
          gap: 1.5,
        }}
      >
        {transportationParameters.map(({ name, label }) => (
          <Controller
            key={name}
            name={name}
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <CustomSelect
                {...field}
                inputRef={field.ref}
                value={field.value ?? ""}
                label={label}
                fullWidth
                options={[{ value: "", label: "Не указан" }, ...(options[name] || [])]}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        ))}
      </Box>
    </StepSection>
  );
}
