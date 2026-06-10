import { useMemo, useState } from "react";
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

export const CUSTOMERS = [
  {
    id: "6a2686g4820346df4d024dc1",
    fullName: "Иванов Иван Иванович",
    iin: "990101300001",
    phone: "+7 701 111 11 11",
  },
  {
    id: "6a2686g4820346df4d024dc2",
    fullName: "Петров Петр Петрович",
    iin: "980202300002",
    phone: "+7 702 222 22 22",
  },
  {
    id: "6a2686g4820346df4d024dc3",
    fullName: "Сидоров Сидор Сидорович",
    iin: "970303300003",
    phone: "+7 703 333 33 33",
  },
  {
    id: "6a2686g4820346df4d024dc4",
    fullName: "Абдуллин Ерлан",
    iin: "960404300004",
    phone: "+7 704 444 44 44",
  },
];

export function ForthStep({ control, errors, setValue }) {
  const selectedCustomerId = useWatch({
    control,
    name: "customer",
  });

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const options = useMemo(() => CUSTOMERS, []);

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
              options={options}
              value={selectedCustomer}
              getOptionLabel={(option) => option?.fullName ?? ""}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              onChange={(_, value) => {
                setSelectedCustomer(value);

                field.onChange(value?.id ?? "");

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
                  <Typography fontWeight={700}>{option.fullName}</Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Заказщик"
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
                <InfoBadge
                  label="ФИО заказщица"
                  value={selectedCustomer.fullName}
                />

                <InfoBadge label="ИИН водителя" value={selectedCustomer.iin} />

                <InfoBadge label="Телефон" value={selectedCustomer.phone} />
              </Box>
            )}
          </Stack>
        )}
      />
    </StepSection>
  );
}
