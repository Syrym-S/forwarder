import { Controller, useWatch } from "react-hook-form";
import PropTypes from "prop-types";
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { StepSection } from "../step-section";
import { InfoBadge } from "../info-badge";
import { useCustomerStore } from "../../../app/store/customers/customers-store";
import { useEffect, useState } from "react";

export function ForthStep({ control, errors, setValue }) {
  const selectedCustomer = useWatch({
    control,
    name: "customer",
  });

  const [inputValue, setInputValue] = useState("");

  const customers = useCustomerStore((state) => state.customers);
  const getCustomers = useCustomerStore((state) => state.getCustomers);
  const searchCustomers = useCustomerStore((state) => state.searchCustomers);
  const isLoading = useCustomerStore((state) => state.isLoading);
  // const options = useMemo(() => CUSTOMERS, []);

  useEffect(() => {
    const value = inputValue.trim();

    const timer = setTimeout(() => {
      if (!value) {
        getCustomers();
        return;
      }

      if (value.length >= 2) {
        searchCustomers({ q: value });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue, getCustomers, searchCustomers]);

  return (
    <StepSection
      title="Выбор заказщика"
      description="Найдите и выберите заказщика, который заказал услугу"
    >
      <Controller
        name="customer"
        control={control}
        render={({ field }) => (
          <Stack spacing={2}>
            <Autocomplete
              options={customers}
              filterOptions={(options) => options}
              value={field.value ?? null}
              loading={isLoading}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              renderValue={(value) => {
                if (!value) return null;

                return (
                  <Chip
                    variant="contained"
                    color="primary"
                    label={value.name}
                  />
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

                setInputValue(value?.name ?? "");

                setValue("customer", value, {
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography fontWeight={700}>{option.name}</Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Выберите заказщика"
                  error={Boolean(errors.customer)}
                  helperText={errors.customer?.message}
                />
              )}
            />

            {selectedCustomer && (
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
                <InfoBadge label="Заказщик" value={selectedCustomer.name} />

                <InfoBadge label="Тип компании" value={selectedCustomer.type} />
              </Box>
            )}
          </Stack>
        )}
      />
    </StepSection>
  );
}
