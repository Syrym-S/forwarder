import { useTranslation } from "react-i18next";
import TooltipIconButton from "../../../shared/ui/tooltip-icon-button";
import renderDriverOption from "../../../shared/ui/render-driver-option";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller } from "react-hook-form";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useDriverStore } from "../../../app/store/drivers/driver-store";
import RenderErrorContext from "../../../shared/ui/errors/render-error-context";
import FormInput from "../../../shared/ui/input/form-input";
import FormControllerInput from "../../../shared/ui/input/form-controller-input";

const PublicationTypeStep = ({
  publicationTypeDisabled = false,
  error,
  setError,
  control,
  formValues,
  selectedDrivers,
  existingParticipants,
  setSelectedDrivers,
  setValue,
}) => {
  const { t } = useTranslation();
  const [selectedDriver, setSelectedDriver] = useState(null);

  const drivers = useDriverStore((state) => state.drivers);
  const isLoading = useDriverStore((state) => state.isLoading);

  const isPublic = formValues?.publication_type;
  const isSelectedDriversExists = selectedDrivers.length + existingParticipants.length > 0;

  const onDriverChange = (_, value) => {
    if (value?.in_black_list === true) return;
    setSelectedDriver(value);

    if (!isPublic) {
      setValue("max_participants", 0);
    }
  };

  const handleAddDriver = () => {
    if (!selectedDriver || selectedDriver.in_black_list === true) return;

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
            disabled={publicationTypeDisabled}
            label={t("ui.public_auction")}
            control={
              <Checkbox
                disabled={publicationTypeDisabled}
                checked={Boolean(field.value)}
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
        label={t("ui.participant_count_2")}
        helperText={t("ui.zero_means_unlimited")}
      />

      <Stack>
        <Autocomplete
          disabled={isPublic || isLoading}
          options={drivers}
          getOptionDisabled={(option) => option.in_black_list === true}
          value={selectedDriver}
          getOptionLabel={(option) => option?.fio ?? ""}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          onChange={onDriverChange}
          renderOption={renderDriverOption}
          renderInput={(params) => (
            <FormInput
              {...params}
              label={isLoading ? t("ui.loading_2") : t("ui.driver")}
              placeholder={t("ui.select_driver")}
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
            disabled={!selectedDriver || selectedDriver.in_black_list === true}
            variant="contained"
            color="primary"
            onClick={handleAddDriver}
          >{t("ui.add")}</Button>
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
              key={participant.id}
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
              >{t("ui.participant_number", { value1: participant?.fio })}</Typography>

              <TooltipIconButton title={t("ui.remove_participant")} aria-label={t("ui.remove_participant")} onClick={() => handleRemoveDriver(participant?.id)}>
                <HighlightOffIcon color="error" />
              </TooltipIconButton>
            </Box>
          ))}
          {existingParticipants.map((participant) => (
            <Box
              key={participant.participant_id}
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
              >{t("ui.participant_number", { value1: participant.fio || participant.participant_id })}</Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </>
  );
};

export default PublicationTypeStep;
