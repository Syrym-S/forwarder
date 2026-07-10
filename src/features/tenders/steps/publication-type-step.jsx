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

const PublicationTypeStep = ({
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
  };

  const handleRemoveDriver = (id) => {
    const filteredDriver = selectedDrivers.filter((driver) => driver.id !== id);

    setSelectedDrivers(filteredDriver);
  };

  return (
    <>
      <Controller
        name="publication_type"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            label="Публичный тендер"
            control={
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
          />
        )}
      />
      <Controller
        name="max_participants"
        disabled={!isPublic}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            value={field.value}
            type="number"
            label="Количество учатсников"
            helperText="0 - без лимит"
          />
        )}
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
                <Typography fontWeight={700}>{option.fio}</Typography>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
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
                  fontWeight: 400,
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
                  fontWeight: 400,
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
