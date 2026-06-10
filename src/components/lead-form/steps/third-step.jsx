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

export const DRIVERS = [
  {
    id: "6a2686b4860546df4d024dc2",
    fullName: "Иванов Иван Иванович",
    iin: "990101300001",
    companyName: "ТОО ТрансЛогистик",
    companyBin: "123456789012",
    phone: "+7 701 111 11 11",
  },
  {
    id: "6a2686b4860346df4d024dc2",
    fullName: "Петров Петр Петрович",
    iin: "980202300002",
    companyName: "ТОО Cargo Express",
    companyBin: "223456789012",
    phone: "+7 702 222 22 22",
  },
  {
    id: "6a2686g4860346df4d024dc2",
    fullName: "Сидоров Сидор Сидорович",
    iin: "970303300003",
    companyName: "ТОО Fast Delivery",
    companyBin: "323456789012",
    phone: "+7 703 333 33 33",
  },
  {
    id: "6a2686g4820346df4d024dc2",
    fullName: "Абдуллин Ерлан",
    iin: "960404300004",
    companyName: "ТОО Kazakhstan Logistics",
    companyBin: "423456789012",
    phone: "+7 704 444 44 44",
  },
];

export function ThirdStep({ control, errors, setValue }) {
  const selectedDriverId = useWatch({
    control,
    name: "driver",
  });

  const [selectedDriver, setSelectedDriver] = useState([]);

  const options = useMemo(() => DRIVERS, []);

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
              options={options}
              value={selectedDriver}
              getOptionLabel={(option) => option?.fullName ?? ""}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              onChange={(_, value) => {
                setSelectedDriver(value);

                field.onChange(value?.id ?? "");

                setValue("driver", value, {
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

                  <Chip size="small" label={option.companyName} />
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Водитель"
                  placeholder="Выберите водитель"
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
                  value={selectedDriver.fullName}
                />

                <InfoBadge label="ИИН водителя" value={selectedDriver.iin} />

                <InfoBadge
                  label="Компания"
                  value={selectedDriver.companyName}
                />

                <InfoBadge
                  label="БИН компании"
                  value={selectedDriver.companyBin}
                />

                <InfoBadge label="Телефон" value={selectedDriver.phone} />
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
