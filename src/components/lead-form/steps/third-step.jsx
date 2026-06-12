import { useEffect, useMemo, useState } from "react";
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
import { useDriverStore } from "../../../app/store/driver-store";

export function ThirdStep({ control, errors, setValue }) {
  const selectedDriver = useWatch({
    control,
    name: "driver",
  });

  // const [selectedDriver, setSelectedDriver] = useState([]);

  const drivers = useDriverStore((state) => state.drivers);
  const isLoading = useDriverStore((state) => state.isLoading);

  // const options = useMemo(() => drivers, []);

  // console.log(options)

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
              multiple
              limitTags={1}
              defaultValue={selectedDriver}
              options={drivers}
              getOptionLabel={(option) => option?.fio ?? ""}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              onChange={(_, value) => {
                field.onChange(value?.id ?? "");

                setValue("driver", value, {
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
              renderOption={(props, option) => {
                console.log(option);

                return (
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
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={isLoading ? "...Загрузка данных" : "Водитель"}
                  placeholder="Выберите водителя"
                  error={Boolean(errors.forwarderId)}
                  helperText={errors.forwarderId?.message}
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
                <InfoBadge
                  label="ФИО водителя"
                  value={selectedDriver[0]?.fio}
                />

                <InfoBadge
                  label="Телефон"
                  value={selectedDriver[0]?.phone || "Не указан"}
                />
              </Box>
            )}
          </Stack>
        )}
      />
    </StepSection>
  );
}

ThirdStep.propTypes = {
  setValue: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
