import { Controller, useWatch } from "react-hook-form";
import PropTypes from "prop-types";
import {
  Autocomplete,
  Box,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { StepSection } from "../step-section";
import { InfoBadge } from "../info-badge";
import { useDriverStore } from "../../../app/store/drivers/driver-store";
import { useEffect, useState } from "react";

export function ThirdStep({ control, errors, setValue }) {
  const selectedDriver = useWatch({
    control,
    name: "driver",
  });

  const [inputValue, setInputValue] = useState("");

  const drivers = useDriverStore((state) => state.drivers);
  const getDrivers = useDriverStore((state) => state.getDrivers);
  const searchDriver = useDriverStore((state) => state.searchDriver);
  const isLoading = useDriverStore((state) => state.isLoading);

  useEffect(() => {
    const value = inputValue.trim();

    const timer = setTimeout(() => {
      if (!value) {
        getDrivers();
        return;
      }

      if (value.length >= 2) {
        searchDriver({ q: value });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue, getDrivers, searchDriver]);

  return (
    <StepSection
      title="Выбор водителя"
      description="Найдите и выберите водителя, который будет закреплен за маршрутом"
    >
      <Controller
        name="driver"
        control={control}
        render={({ field }) => (
          <Stack spacing={2}>
            <Autocomplete
              options={drivers}
              value={field.value ?? null}
              loading={isLoading}
              inputValue={inputValue}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              onInputChange={(_, newInputValue, reason) => {
                if (reason === "input") {
                  setInputValue(newInputValue);
                }

                if (reason === "clear") {
                  setInputValue("");
                }
              }}
              onChange={(_, value) => {
                field.onChange(value);

                setInputValue(value?.fio ?? "");
              }}
              getOptionLabel={(option) => option?.fio ?? ""}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography fontWeight={700}>{option.fio}</Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Выберите водителя"
                  error={Boolean(errors.driver)}
                  helperText={errors.driver?.message}
                />
              )}
            />

            {selectedDriver && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                <InfoBadge label="ФИО водителя" value={selectedDriver.fio} />

                <InfoBadge
                  label="Телефон"
                  value={selectedDriver.phone || "Не указан"}
                />
              </Box>
            )}
          </Stack>
        )}
      />
    </StepSection>
  );
}
