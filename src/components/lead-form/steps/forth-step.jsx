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
import { useCustomerStore } from "../../../app/store/customers/customers-store";

export function ForthStep({ control, errors, setValue }) {
  const selectedCustomer = useWatch({
    control,
    name: "customer",
  });

  // const [selectedCustomer, setSelectedCustomer] = useState([]);

  const customers = useCustomerStore((state) => state.customers);
  const isLoading = useCustomerStore((state) => state.isLoading);
  // const options = useMemo(() => CUSTOMERS, []);

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
              disabled={isLoading}
              options={customers}
              defaultValue={selectedCustomer}
              getOptionLabel={(option) => option?.name ?? ""}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              onChange={(_, value) => {
                if (value?.length > 1) return;

                setValue("customer", value, {
                  shouldDirty: true,
                  shouldTouch: true,
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
                  label={isLoading ? "...Загрузка данных" : "Заказщик"}
                  placeholder="Выберите заказщика"
                  error={Boolean(errors.forwarderId)}
                  helperText={errors.forwarderId?.message}
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
