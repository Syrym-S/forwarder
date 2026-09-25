import FormControllerSelect from "../../../shared/ui/input/form-controller-select";
import dayjs from "dayjs";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FormControllerInput from "../../../shared/ui/input/form-controller-input";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Typography,
} from "@mui/material";
import { StepSection } from "../step-section";
import { useCustomerMap } from "../use-customer-map";
import { CustomerMapView } from "../map-view";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { useRouteMapPicker } from "../use-route-map-picker";
import { STATUS } from "../../../shared/const/tenders";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import PrimaryButton from "../../../shared/ui/button/primary-button";

const waypointTypes = [
  { id: 1, value: "check_passes", label: "Транзит" },
  { id: 2, value: "loading", label: "Погрузка" },
  { id: 3, value: "unloading", label: "Разгрузка" },
];

const RouteStep = ({ control, form, setValue, isEdit = false }) => {
  const currentLead = useLeadsStore((state) => state.currentLead);

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
        "Дата не может быть раньше сегодняшнего дня"
      );
    }

    const previousEndAt = pointSchedules?.[scheduleIndex - 1]?.end_at;

    if (!previousEndAt) {
      return true;
    }

    return (
      !dayjs(value).isBefore(dayjs(previousEndAt), "day") ||
      "Дата начала не может быть раньше окончания предыдущей точки"
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
      "Дата окончания не может быть раньше даты начала"
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
    <StepSection title="Маршрут">
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
            text="Откуда"
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
              text={`Точка # ${index + 1}`}
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
            text="Куда"
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
            text="Добавить точку пересечения"
          />

          <PrimaryButton
            size="small"
            color="error"
            variant="outlined"
            onClick={handleClearRoute}
            disabled={isClearDisabled || (currentLead && !canEditStatus)}
            text="Очистить маршрут"
            sx={{
              p: 0,
              px: 1,
            }}
          />
        </Box>
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
          markers={routeMarkers}
          routePoints={routePoints}
          handleMarkerClick={map.handleMarkerClick}
          onMapClick={handleRouteMapClick}
          onMarkerDragEnd={handleRouteMarkerDragEnd}
        />
      </Box>

      {/* ================= LOCK MESSAGE ================= */}

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

          <Typography variant="body2" color="error">
            При текущем статусе нельзя редактировать маршрут
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 2,
        }}
      >
        {/* ================= FROM ================= */}

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
            label="Откуда"
            fullWidth
            size="small"
            rules={{
              required: "Укажите место отправления",
              minLength: {
                value: 3,
                message: "Минимум 3 символа",
              },
            }}
            onChange={() => {
              clearFromPoint();
            }}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />

          {/* FROM START */}

          <FormControllerInput
            name="point_schedules[0].start_at"
            control={control}
            rules={{
              required: "Дата начала обязательна",

              validate: (value) => validateStartDate(value, 0),
            }}
            label="Начало (Откуда)"
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

          {/* FROM END */}

          <FormControllerInput
            name="point_schedules[0].end_at"
            control={control}
            rules={{
              required: "Дата окончания обязательна",

              validate: (value) => validateEndDate(value, 0),
            }}
            label="Окончание (Откуда)"
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

        {/* ================= WAYPOINTS ================= */}

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
            >
              Промежуточные точки
            </Typography>

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
                    label={`Промежуточная точка #${index + 1}`}
                    fullWidth
                    size="small"
                    disabled={currentLead && !canEditStatus}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />

                  <FormControllerSelect
                    name={`waypoints[${index}].type`}
                    control={control}
                    defaultValue="check_passes"
                    options={waypointTypes}
                    label="Тип"
                    fullWidth
                    size="small"
                    disabled={currentLead && !canEditStatus}
                  />

                  <FormControllerInput
                    name={`point_schedules[${scheduleIndex}].start_at`}
                    control={control}
                    rules={{
                      required: "Дата начала обязательна",

                      validate: (value) =>
                        validateStartDate(value, scheduleIndex),
                    }}
                    label={`Начало (Точка ${index + 1})`}
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
                      required: "Дата окончания обязательна",

                      validate: (value) =>
                        validateEndDate(value, scheduleIndex),
                    }}
                    label={`Окончание (Точка ${index + 1})`}
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
                    text="Убрать"
                  />
                </Box>
              );
            })}
          </Box>
        )}

        {/* ================= TO ================= */}

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
            label="Куда"
            fullWidth
            size="small"
            onChange={clearToPoint}
            rules={{
              required: "Укажите место назначения",
              minLength: {
                value: 3,
                message: "Минимум 3 символа",
              },
            }}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />

          {/* TO START */}

          <FormControllerInput
            name={`point_schedules[${toScheduleIndex}].start_at`}
            control={control}
            rules={{
              required: "Дата начала обязательна",

              validate: (value) => validateStartDate(value, toScheduleIndex),
            }}
            label="Начало (Куда)"
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
              required: "Дата окончания обязательна",

              validate: (value) => validateEndDate(value, toScheduleIndex),
            }}
            label="Окончание (Куда)"
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

      {/* ================= ERROR SNACKBAR ================= */}

      <Snackbar
        open={hasFromCityError || hasToCityError || hasCrossPointCityError}
        autoHideDuration={1000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          Неправильные параметры города. Попытайтесь выбрать другую точку
        </Alert>
      </Snackbar>
      <Box sx={{ mt: 2, p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        <Controller
          name="passVerify"
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
              label="Пропуск видеофиксации разгрузки/погрузки"
            />
          )}
        />
        <Typography variant="body2" color="text.secondary">
          При включении подтверждение погрузки и разгрузки экспедитором не требуется.
          После создания перевозки изменить настройку нельзя.
        </Typography>
      </Box>
    </StepSection>
  );
};

export default RouteStep;
