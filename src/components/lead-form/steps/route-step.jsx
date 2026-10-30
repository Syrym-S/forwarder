import appI18n from "../../../i18n/index.js";
import { useTranslation } from "react-i18next";
import FormControllerSelect from "../../../shared/ui/input/form-controller-select";
import dayjs from "dayjs";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FormControllerInput from "../../../shared/ui/input/form-controller-input";
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Stack,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { StepSection } from "../step-section";
import { useCustomerMap } from "../use-customer-map";
import { CustomerMapView } from "../map-view";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { useRouteMapPicker } from "../use-route-map-picker";
import { STATUS } from "../../../shared/const/tenders";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import PrimaryButton from "../../../shared/ui/button/primary-button";
import { isInternationalRoute } from "../../../shared/lib/international-route";
import { useEffect, useState } from "react";
import CustomSelect from "../../../shared/ui/input/custom-select";
import { KAZAKHSTAN_MAP_CITIES } from "../model/kazakhstan-map-cities";
import MapAddressSearch from "../map-address-search";

const waypointTypes = [
  { id: 1, value: "check_passes", get label() { return appI18n.t("lead_form.transit"); } },
  { id: 2, value: "loading", get label() { return appI18n.t("ui.loading_operation"); } },
  { id: 3, value: "unloading", get label() { return appI18n.t("ui.unloading_operation"); } },
];

const RouteStep = ({ control, form, setValue, isEdit = false }) => {
  const { t, i18n } = useTranslation();
  const [selectedMapCityId, setSelectedMapCityId] = useState("");
  const [mapFocus, setMapFocus] = useState(null);
  const selectedMapCity = KAZAKHSTAN_MAP_CITIES.find(
    (city) => city.id === selectedMapCityId,
  ) ?? null;
  const mapCityOptions = KAZAKHSTAN_MAP_CITIES.map((city) => ({
    value: city.id,
    label: t(`lead_form.map_cities.${city.id}`),
  })).sort((first, second) =>
    first.label.localeCompare(second.label, i18n.resolvedLanguage),
  );
  const currentLead = useLeadsStore((state) => state.currentLead);
  const isInternational = isInternationalRoute(form);

  useEffect(() => {
    if (form.is_international !== isInternational) {
      setValue("is_international", isInternational, { shouldValidate: true });
    }
  }, [form.is_international, isInternational, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "waypoints",
  });

  const { append: appendSchedule, remove: removeSchedule } = useFieldArray({
    control,
    name: "point_schedules",
  });

  const pointSchedules =
    useWatch({
      control,
      name: "point_schedules",
    }) || [];

  const canEditStatus =
    currentLead?.status === STATUS.new ||
    currentLead?.status === STATUS.add_driver;

  const today = dayjs().format("YYYY-MM-DD");

  const getMinDate = (date) => {
    if (!date) {
      return today;
    }

    return dayjs(date).isAfter(dayjs(today), "day")
      ? dayjs(date).format("YYYY-MM-DD")
      : today;
  };

  const validateStartDate = (value, scheduleIndex) => {
    if (!value) {
      return true;
    }

    if (scheduleIndex === 0) {
      return (
        !dayjs(value).isBefore(dayjs(today), "day") ||
        t("ui.date_cannot_be_before_today")
      );
    }

    const previousEndAt = pointSchedules?.[scheduleIndex - 1]?.end_at;

    if (!previousEndAt) {
      return true;
    }

    return (
      !dayjs(value).isBefore(dayjs(previousEndAt), "day") ||
      t("lead_form.start_date_after_previous_point")
    );
  };

  const validateEndDate = (value, scheduleIndex) => {
    if (!value) {
      return true;
    }

    const currentStartAt = pointSchedules?.[scheduleIndex]?.start_at;

    if (!currentStartAt) {
      return true;
    }

    return (
      !dayjs(value).isBefore(dayjs(currentStartAt), "day") ||
      t("lead_form.end_date_after_start")
    );
  };

  const handleShowFiled = () => {
    append({
      address: null,
      city: null,
      country: null,
      lat: null,
      lon: null,
      region: null,
      type: "check_passes",
    });

    appendSchedule({
      start_at: "",
      end_at: "",
      point_index: fields.length + 1,
    });
  };

  const handleRemoveWaypoint = (index) => {
    remove(index);
    removeSchedule(index + 1);
  };

  const map = useCustomerMap();

  const {
    activeMapPoint,
    routeMarkers,
    routePoints,
    isClearDisabled,
    setActiveMapPoint,
    handleRouteMapClick,
    handleRouteMarkerDragEnd,
    handleClearRoute,
    clearFromPoint,
    clearToPoint,
    setCount,
    hasFromCityError,
    hasCrossPointCityError,
    hasToCityError,
  } = useRouteMapPicker({
    form,
    fields,
    setValue,
  });

  const toScheduleIndex = fields.length + 1;

  return (
    <StepSection title={t("ui.route")}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <PrimaryButton
            size="small"
            variant={activeMapPoint === "from" ? "contained" : "outlined"}
            onClick={() => {
              setActiveMapPoint("from");
              setCount(0);
            }}
            text={t("ui.origin")}
          />

          {fields.map((field, index) => (
            <PrimaryButton
              key={field.id}
              size="small"
              disabled={currentLead && !canEditStatus}
              variant={
                activeMapPoint === `cross.${index}` ? "contained" : "outlined"
              }
              onClick={() => {
                setActiveMapPoint(`cross.${index}`);
                setCount(index);
              }}
              sx={{
                py: 0,
              }}
              text={t("lead_form.route_point_number", { value1: index + 1 })}
            />
          ))}

          <PrimaryButton
            size="small"
            variant={activeMapPoint === "to" ? "contained" : "outlined"}
            disabled={currentLead && !canEditStatus}
            onClick={() => setActiveMapPoint("to")}
            sx={{
              py: 0,
            }}
            text={t("ui.destination")}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <PrimaryButton
            size="small"
            color="primary"
            variant="outlined"
            onClick={handleShowFiled}
            disabled={currentLead && !canEditStatus}
            text={t("lead_form.add_crossing_point")}
          />

          <PrimaryButton
            size="small"
            color="error"
            variant="outlined"
            onClick={handleClearRoute}
            disabled={isClearDisabled || (currentLead && !canEditStatus)}
            text={t("lead_form.clear_route")}
            sx={{
              p: 0,
              px: 1,
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 2, mb: 2 }}>
        <CustomSelect
          id="lead-map-city"
          label={t("lead_form.map_city")}
          value={selectedMapCityId}
          options={[
            { value: "", label: t("lead_form.select_map_city") },
            ...mapCityOptions,
          ]}
          onChange={(event) => {
            const cityId = event.target.value;
            setSelectedMapCityId(cityId);
            setMapFocus(KAZAKHSTAN_MAP_CITIES.find((city) => city.id === cityId) ?? null);
          }}
          helperText={t("lead_form.map_city_hint")}
          sx={{ width: { xs: "100%", sm: 280 }, flexShrink: 0 }}
          slotProps={{
            select: {
              MenuProps: { slotProps: { paper: { sx: { maxHeight: 430 } } } },
            },
          }}
        />
        <MapAddressSearch
          key={selectedMapCityId}
          city={selectedMapCity}
          onSelect={setMapFocus}
        />
      </Box>

      <Box
        sx={{
          height: {
            xs: 220,
            sm: 280,
          },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
          mb: 2,
        }}
      >
        <CustomerMapView
          center={map.center}
          zoom={map.zoom}
          focusView={mapFocus}
          markers={routeMarkers}
          routePoints={routePoints}
          handleMarkerClick={map.handleMarkerClick}
          onMapClick={handleRouteMapClick}
          onMarkerDragEnd={handleRouteMarkerDragEnd}
        />
      </Box>

      {currentLead && !canEditStatus && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1.5,
            my: 1,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <LockOutlinedIcon color="error" fontSize="small" />

          <Typography variant="body2" color="error">{t("lead_form.route_edit_status_restriction")}</Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "2fr 1fr 1fr",
            },
            gap: 1,
          }}
        >
          <FormControllerInput
            name="from_location.address"
            control={control}
            label={t("ui.origin")}
            fullWidth
            size="small"
            rules={{
              required: t("lead_form.enter_origin"),
              minLength: {
                value: 3,
                message: t("lead_form.minimum_three_characters"),
              },
            }}
            slotProps={{
              input: {
                readOnly: false,
                endAdornment: form.from_location?.address ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label={t("lead_form.clear_origin")}
                      onClick={() => {
                        clearFromPoint();
                        setValue(
                          "from_location",
                          {
                            address: "",
                            city: "",
                            country: "",
                            region: "",
                            lat: "",
                            lng: "",
                          },
                          { shouldDirty: true, shouldValidate: true },
                        );
                      }}
                    >
                      <CloseOutlinedIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          <FormControllerInput
            name="point_schedules[0].start_at"
            control={control}
            rules={{
              required: t("lead_form.start_date_required"),

              validate: (value) => validateStartDate(value, 0),
            }}
            label={t("lead_form.origin_start")}
            type="date"
            fullWidth
            size="small"
            onChange={() => {
              setValue("point_schedules[0].point_index", 0);
            }}
            slotProps={{
              htmlInput: {
                min: today,
              },
            }}
          />

          <FormControllerInput
            name="point_schedules[0].end_at"
            control={control}
            rules={{
              required: t("lead_form.end_date_required"),

              validate: (value) => validateEndDate(value, 0),
            }}
            label={t("lead_form.origin_end")}
            type="date"
            fullWidth
            size="small"
            onChange={() => {
              setValue("point_schedules[0].point_index", 0);
            }}
            slotProps={{
              htmlInput: {
                min: getMinDate(pointSchedules?.[0]?.start_at),
              },
            }}
          />
        </Box>

        {fields.length > 0 && (
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "font_color.heading",
              }}
            >{t("lead_form.waypoints")}</Typography>

            {fields.map((crossField, index) => {
              const scheduleIndex = index + 1;

              const previousEndAt = pointSchedules?.[scheduleIndex - 1]?.end_at;

              const currentStartAt = pointSchedules?.[scheduleIndex]?.start_at;

              return (
                <Box
                  key={crossField.id}
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-start",
                  }}
                >
                  <FormControllerInput
                    name={`waypoints[${index}].address`}
                    control={control}
                    label={t("ui.waypoint_number", { value1: index + 1 })}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: false,
                      },
                    }}
                  />

                  <FormControllerSelect
                    name={`waypoints[${index}].type`}
                    control={control}
                    defaultValue="check_passes"
                    options={waypointTypes}
                    label={t("ui.type")}
                    fullWidth
                    size="small"
                    disabled={currentLead && !canEditStatus}
                  />

                  <FormControllerInput
                    name={`point_schedules[${scheduleIndex}].start_at`}
                    control={control}
                    rules={{
                      required: t("lead_form.start_date_required"),

                      validate: (value) =>
                        validateStartDate(value, scheduleIndex),
                    }}
                    label={t("lead_form.waypoint_start", { value1: index + 1 })}
                    type="date"
                    fullWidth
                    size="small"
                    onChange={() => {
                      setValue(
                        `point_schedules[${scheduleIndex}].point_index`,
                        scheduleIndex,
                      );
                    }}
                    slotProps={{
                      htmlInput: {
                        min: getMinDate(previousEndAt),
                      },
                    }}
                  />

                  <FormControllerInput
                    name={`point_schedules[${scheduleIndex}].end_at`}
                    control={control}
                    rules={{
                      required: t("lead_form.end_date_required"),

                      validate: (value) =>
                        validateEndDate(value, scheduleIndex),
                    }}
                    label={t("lead_form.waypoint_end", { value1: index + 1 })}
                    type="date"
                    fullWidth
                    size="small"
                    onChange={() => {
                      setValue(
                        `point_schedules[${scheduleIndex}].point_index`,
                        scheduleIndex,
                      );
                    }}
                    slotProps={{
                      htmlInput: {
                        min: getMinDate(currentStartAt),
                      },
                    }}
                  />

                  <PrimaryButton
                    disabled={currentLead && !canEditStatus}
                    onClick={() => handleRemoveWaypoint(index)}
                    color="error"
                    variant="outlined"
                    text={t("lead_form.remove")}
                  />
                </Box>
              );
            })}
          </Box>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "2fr 1fr 1fr",
            },
            gap: 1,
          }}
        >
          <FormControllerInput
            name="to_location.address"
            control={control}
            label={t("ui.destination")}
            fullWidth
            size="small"
            rules={{
              required: t("lead_form.enter_destination"),
              minLength: {
                value: 3,
                message: t("lead_form.minimum_three_characters"),
              },
            }}
            slotProps={{
              input: {
                readOnly: false,
                endAdornment: form.to_location?.address ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label={t("lead_form.clear_destination")}
                      onClick={() => {
                        clearToPoint();
                        setValue(
                          "to_location",
                          {
                            address: "",
                            city: "",
                            country: "",
                            region: "",
                            lat: "",
                            lng: "",
                          },
                          { shouldDirty: true, shouldValidate: true },
                        );
                      }}
                    >
                      <CloseOutlinedIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          {/* TO START */}

          <FormControllerInput
            name={`point_schedules[${toScheduleIndex}].start_at`}
            control={control}
            rules={{
              required: t("lead_form.start_date_required"),

              validate: (value) => validateStartDate(value, toScheduleIndex),
            }}
            label={t("lead_form.destination_start")}
            type="date"
            fullWidth
            size="small"
            onChange={() => {
              setValue(
                `point_schedules[${toScheduleIndex}].point_index`,
                toScheduleIndex,
              );
            }}
            slotProps={{
              htmlInput: {
                min: getMinDate(pointSchedules?.[toScheduleIndex - 1]?.end_at),
              },
            }}
          />

          {/* TO END */}

          <FormControllerInput
            name={`point_schedules[${toScheduleIndex}].end_at`}
            control={control}
            rules={{
              required: t("lead_form.end_date_required"),

              validate: (value) => validateEndDate(value, toScheduleIndex),
            }}
            label={t("lead_form.destination_end")}
            type="date"
            fullWidth
            size="small"
            onChange={() => {
              setValue(
                `point_schedules[${toScheduleIndex}].point_index`,
                toScheduleIndex,
              );
            }}
            slotProps={{
              htmlInput: {
                min: getMinDate(pointSchedules?.[toScheduleIndex]?.start_at),
              },
            }}
          />
        </Box>
      </Box>

      <Snackbar
        open={hasFromCityError || hasToCityError || hasCrossPointCityError}
        autoHideDuration={1000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>{t("lead_form.invalid_city_parameters")}</Alert>
      </Snackbar>

      <Box
        sx={{
          mt: 2,
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Controller
          name="is_international"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  name={field.name}
                  checked={isInternational}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                />
              }
              label={t("lead_form.international_lead")}
            />
          )}
        />
        <Typography variant="body2" color="text.secondary">{t("lead_form.international_lead_hint")}</Typography>
      </Box>
      <Box
        sx={{
          mt: 2,
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Controller
          name="pass_verify"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  name={field.name}
                  checked={field.value === true}
                  onChange={(_, checked) => field.onChange(checked)}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  disabled={isEdit}
                />
              }
              label={t("ui.skip_loading_unloading_file_confirmation")}
            />
          )}
        />
        <Typography variant="body2" color="text.secondary">{t("lead_form.skip_file_confirmation_hint")}</Typography>
        {form.pass_verify === true && !isEdit && (
          <Alert severity="warning" sx={{ mt: 1.5, borderRadius: 2 }}>{t("lead_form.skip_file_confirmation_locked_hint")}</Alert>
        )}
      </Box>
      <Controller
        name="auto_start"
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <Stack spacing={1} sx={{ mt: 2 }}>
            <FormControlLabel
              label={t("lead_form.automatically_assign_driver")}
              control={
                <Checkbox
                  name={field.name}
                  checked={field.value === true}
                  onChange={(_, checked) => field.onChange(checked)}
                  onBlur={field.onBlur}
                  slotProps={{
                    input: {
                      ref: field.ref,
                      "aria-describedby": "auto-start-warning",
                    },
                  }}
                />
              }
            />
            <Alert id="auto-start-warning" severity="warning">{t("lead_form.automatic_assignment_locked_hint")}</Alert>
          </Stack>
        )}
      />
    </StepSection>
  );
};

export default RouteStep;
