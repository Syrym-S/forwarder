import { useTranslation } from "react-i18next";
import renderDriverOption from "../../../shared/ui/render-driver-option";
import { Controller, useWatch } from "react-hook-form";
import {
  Alert,
  Autocomplete,
  Box,
  Chip,
  Stack,
  TextField,
} from "@mui/material";
import { StepSection } from "../step-section";
import { InfoBadge } from "../info-badge";
import { useDriverStore } from "../../../app/store/drivers/driver-store";
import { useEffect, useState } from "react";

const DriverStep = ({ control, errors, setValue }) => {
  const { t } = useTranslation();
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
      title={t("lead_form.driver_selection")}
      description={t("lead_form.select_driver_description")}
    >
      <Controller
        name="driver"
        control={control}
        render={({ field }) => (
          <Stack spacing={2}>
            <Autocomplete
              inputValue={inputValue}
              options={drivers}
              getOptionDisabled={(option) => option.in_black_list === true}
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
                      color={value.in_black_list === true ? "error" : "primary"}
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
                if (value?.in_black_list === true) return;

                field.onChange(value);

                setInputValue("");

                setValue("driver", value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
              renderOption={renderDriverOption}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t("ui.select_driver")}
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

            {selectedDriver?.in_black_list === true && (
              <Alert severity="error">{t("ui.driver_blocked")}</Alert>
            )}

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
                <InfoBadge label={t("lead_form.driver_full_name")} value={selectedDriver.fio} />

                <InfoBadge
                  label={t("ui.phone_2")}
                  value={selectedDriver.phone || t("ui.not_specified")}
                />

                <InfoBadge
                  label="Email"
                  value={selectedDriver.email || t("ui.not_specified")}
                />
                <InfoBadge
                  label={t("ui.iin")}
                  value={selectedDriver.iin || t("ui.not_specified")}
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
