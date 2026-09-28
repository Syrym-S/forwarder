import { Alert, Box, Button } from "@mui/material";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useOptionsStore } from "../../../app/store/options";
import { transportationParameters } from "../../../shared/const/leads/transportation-parameters";
import CustomSelect from "../../../shared/ui/input/custom-select";
import { StepSection } from "../step-section";

export default function TransportationParameters({ control }) {
  const getLeadParams = useOptionsStore((state) => state.getLeadParams);
  const leadParams = useOptionsStore((state) => state.leadParams);
  const isLoading = useOptionsStore((state) => state.isLeadParamsLoading);
  const error = useOptionsStore((state) => state.leadParamsError);

  useEffect(() => {
    getLeadParams();
  }, [getLeadParams]);

  return (
    <StepSection title="Параметры перевозки">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} action={
          <Button color="inherit" size="small" onClick={getLeadParams} disabled={isLoading}>
            Повторить
          </Button>
        }>
          Не удалось загрузить параметры перевозки
        </Alert>
      )}
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
            render={({ field, fieldState }) => {
              const options = (leadParams[name] || []).map(({ name }) => ({ value: name, label: name }));
              const value = field.value ?? "";
              // Preserve an existing selection while options load or if it was removed from the dictionary.
              if (value !== "" && !options.some((option) => String(option.value) === String(value))) {
                options.push({ value, label: String(value) });
              }
              return (
              <CustomSelect
                {...field}
                inputRef={field.ref}
                value={value}
                label={label}
                fullWidth
                disabled={isLoading || !!error}
                options={[{ value: "", label: "Не указан" }, ...options]}
                error={!!fieldState.error}
                helperText={fieldState.error?.message || (isLoading ? "Загрузка…" : undefined)}
              />
              );
            }}
          />
        ))}
      </Box>
    </StepSection>
  );
}
