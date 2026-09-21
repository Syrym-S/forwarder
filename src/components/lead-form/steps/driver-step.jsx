import { Controller, useWatch } from "react-hook-form";
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

const DriverStep = ({ control, errors, setValue }) => {
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

      searchDriver({ q: value });
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
              inputValue={inputValue}
              options={drivers}
              filterOptions={(options) => options}
              value={field.value ?? null}
              loading={isLoading}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              renderValue={(value) => {
                if (!value) return null;

                return (
                  selectedDriver?.fio && (
                    <Chip
                      variant="contained"
                      color="primary"
                      label={value.fio}
                    />
                  )
                );
              }}
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

                setInputValue("");

                setValue("driver", value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    px: "16px !important",
                    py: "10px !important",
                    borderBottom: "1px solid",
                    borderColor: "divider",

                    display: "flex !important",
                    flexDirection: "column !important",
                    alignItems: "flex-start !important",
                    gap: "5px !important",

                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "text.primary",
                        lineHeight: 1.3,
                      }}
                    >
                      {option.fio || "Без имени"}
                    </Typography>

                    {option.company_name && (
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: "primary.main",
                          bgcolor: "primary.50",
                          borderRadius: 1,
                          px: 0.75,
                          py: 0.2,
                        }}
                      >
                        {option.company_name}
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {option.iin && (
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "text.secondary",
                        }}
                      >
                        ИИН:{" "}
                        <Box
                          component="span"
                          sx={{ color: "text.primary", fontWeight: 500 }}
                        >
                          {option.iin}
                        </Box>
                      </Typography>
                    )}

                    {option.phone && (
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "text.secondary",
                        }}
                      >
                        Тел:{" "}
                        <Box
                          component="span"
                          sx={{ color: "text.primary", fontWeight: 500 }}
                        >
                          +{option.phone}
                        </Box>
                      </Typography>
                    )}

                    {option.email && (
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "text.secondary",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 250,
                        }}
                      >
                        {option.email}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Выберите водителя"
                  error={Boolean(errors.driver)}
                  helperText={errors.driver?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
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

                <InfoBadge
                  label="Email"
                  value={selectedDriver.email || "Не указан"}
                />
                <InfoBadge
                  label="ИИН"
                  value={selectedDriver.iin || "Не указан"}
                />
              </Box>
            )}
          </Stack>
        )}
      />
    </StepSection>
  );
};

export default DriverStep;
