import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useTendersStore } from "../../../app/store/tenders/tender-store";
import { useDriverStore } from "../../../app/store/drivers/driver-store";
import RenderErrorContext from "../../../shared/ui/errors/render-error-context";
import FormInput from "../../../shared/ui/input/form-input";
import FormControllerInput from "../../../shared/ui/input/form-controller-input";

const PublicationTypeStep = ({
  error,
  setError,
  control,
  formValues,
  selectedDrivers,
  setSelectedDrivers,
  setValue,
}) => {
  const [selectedDriver, setSelectedDriver] = useState(null);

  const drivers = useDriverStore((state) => state.drivers);
  const isLoading = useDriverStore((state) => state.isLoading);
  const currentTender = useTendersStore((state) => state.currentTender);

  const isPublic = formValues?.publication_type;
  const isSelectedDriversExists = selectedDrivers?.length !== 0;

  const onDriverChange = (_, value) => {
    setSelectedDriver(value);

    if (!isPublic) {
      setValue("max_participants", 0);
    }
  };

  const handleAddDriver = () => {
    setSelectedDrivers((prev) => [...prev, selectedDriver]);
    setSelectedDriver(null);
    setError(null);
  };

  const handleRemoveDriver = (id) => {
    const filteredDriver = selectedDrivers.filter((driver) => driver.id !== id);

    setSelectedDrivers(filteredDriver);
  };

  return (
    <>
      {error && <RenderErrorContext error={error} />}

      <Controller
        name="publication_type"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            label="Публичный аукцион"
            control={
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
          />
        )}
      />

      <FormControllerInput
        name="max_participants"
        control={control}
        disabled={!isPublic}
        type="number"
        label="Количество участников"
        helperText="0 - без лимита"
      />

      <Stack>
        <Autocomplete
          disabled={isPublic || isLoading}
          options={drivers}
          value={selectedDriver}
          getOptionLabel={(option) => option?.fio ?? ""}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          onChange={onDriverChange}
          renderOption={(props, option) => {
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
                <Typography fontSize={14} fontWeight={600}>{option.fio}</Typography>
              </Box>
            );
          }}
          renderInput={(params) => (
            <FormInput
              {...params}
              label={isLoading ? "...Загрузка данных" : "Водитель"}
              placeholder="Выберите водителя"
            />
          )}
        />

        <Box
          sx={{
            my: 1,
            display: "flex",
            gap: "10px",
          }}
        >
          <Button
            disabled={!selectedDriver}
            variant="contained"
            color="primary"
            onClick={handleAddDriver}
          >
            Добавить
          </Button>
        </Box>

        <Box
          sx={{
            mt: 1,
            py: 1.5,
            px: 0.5,
            border: isSelectedDriversExists
              ? "1px solid rgba(0,0,0,0.1)"
              : "none",
            maxHeight: 200,
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "10px",
            overflowY: "auto",
          }}
        >
          {selectedDrivers?.map((participant) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  width: "100%",
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "color.slate_2",
                }}
              >
                Участник {participant?.fio}
              </Typography>

              <IconButton onClick={() => handleRemoveDriver(participant?.id)}>
                <HighlightOffIcon color="error" />
              </IconButton>
            </Box>
          ))}
          {currentTender?.participants?.map((participant) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  width: "100%",
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "color.slate_2",
                }}
              >
                Участник {participant?.participant_id}
              </Typography>

              <IconButton
              // onClick={() => handleRemoveDriver(participant?.participant_id)}
              >
                <HighlightOffIcon color="error" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Stack>
    </>
  );
};

export default PublicationTypeStep;
