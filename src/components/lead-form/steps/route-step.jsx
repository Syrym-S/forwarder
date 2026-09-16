import dayjs from "dayjs";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FormControllerInput from "../../../shared/ui/input/form-controller-input";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Snackbar,
  Typography,
} from "@mui/material";
import { StepSection } from "../step-section";
import { useCustomerMap } from "../use-customer-map";
import { CustomerMapView } from "../map-view";
import { useFieldArray } from "react-hook-form";
import { useRouteMapPicker } from "../use-route-map-picker";
import { STATUS } from "../../../shared/const/tenders";
import { useLeadsStore } from "../../../app/store/leads/leads-store";

const waypointTypes = [
  { id: 1, value: "check_passes", label: "Транзит" },
  { id: 2, value: "loading", label: "Погрузка" },
  { id: 3, value: "unloading", label: "Разгрузка" },
];
const RouteStep = ({ control, form, setValue }) => {
  const currentLead = useLeadsStore((state) => state.currentLead);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "waypoints",
  });

  const { append: appendSchedule } = useFieldArray({
    control,
    name: "point_schedules",
  });

  const canEditStatus =
    currentLead?.status === STATUS.new ||
    currentLead?.status === STATUS.add_driver;

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
      date: "",
    });
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
          <Button
            size="small"
            variant={activeMapPoint === "from" ? "contained" : "outlined"}
            onClick={() => {
              setActiveMapPoint("from");
              setCount(0);
            }}
            sx={{
              borderRadius: 2,
            }}
          >
            Откуда
          </Button>

          {fields.map((_, index) => (
            <Button
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
                borderRadius: 2,
              }}
            >
              Точка #{index + 1}
            </Button>
          ))}

          <Button
            size="small"
            variant={activeMapPoint === "to" ? "contained" : "outlined"}
            disabled={currentLead && !canEditStatus}
            onClick={() => setActiveMapPoint("to")}
            sx={{
              borderRadius: 2,
            }}
          >
            Куда
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <Button
            size="small"
            color="primary"
            variant="outlined"
            onClick={handleShowFiled}
            disabled={currentLead && !canEditStatus}
            sx={{
              borderRadius: 2,
            }}
          >
            Добавить точку пересечения
          </Button>

          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={handleClearRoute}
            disabled={isClearDisabled || (currentLead && !canEditStatus)}
            sx={{
              borderRadius: 2,
            }}
          >
            Очистить маршрут
          </Button>
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
            По текущему статусу, нельзя редактировать маршрут
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
            read
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

          <FormControllerInput
            name={`point_schedules[0].start_at`}
            control={control}
            rules={{
              required: "Дата начала обязательна",
            }}
            label={`Начало (Откуда)`}
            type="date"
            fullWidth
            size="small"
            onChange={() => {
              setValue(`point_schedules[0].point_index`, 0);
            }}
            slotProps={{
              htmlInput: {
                min: dayjs().format("YYYY-MM-DD"),
              },
            }}
          />

          <FormControllerInput
            name={`point_schedules[0].end_at`}
            rules={{
              required: "Дата оконяания обязательна",
            }}
            control={control}
            label={`Окончание (Откуда)`}
            type="date"
            fullWidth
            size="small"
            onChange={() => {
              setValue(`point_schedules[0].point_index`, 0);
            }}
            slotProps={{
              htmlInput: {
                min: dayjs().format("YYYY-MM-DD"),
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
                сolor: "font_color.heading",
              }}
            >
              Промежуточные точки
            </Typography>

            {fields.map((crossField, index) => (
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
                  disabled={!canEditStatus}
                  onChange={clearFromPoint}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

                <FormControllerInput
                  name={`waypoints[${index}].type`}
                  control={control}
                  defaultValue="check_passes"
                  select
                  label="Тип"
                  fullWidth
                  size="small"
                >
                  {waypointTypes.map((type) => (
                    <MenuItem key={type.id} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </FormControllerInput>

                <FormControllerInput
                  name={`point_schedules[${index + 1}].start_at`}
                  rules={{
                    required: "Дата начала обязательна",
                  }}
                  control={control}
                  label={`Начало (Точка ${index + 1})`}
                  type="date"
                  fullWidth
                  size="small"
                  onChange={() => {
                    setValue(
                      `point_schedules[${index + 1}].point_index`,
                      index + 1,
                    );
                  }}
                  slotProps={{
                    htmlInput: {
                      min: dayjs().format("YYYY-MM-DD"),
                    },
                  }}
                />

                <FormControllerInput
                  name={`point_schedules[${index + 1}].end_at`}
                  rules={{
                    required: "Дата оконяания обязательна",
                  }}
                  control={control}
                  label={`Окончание (Точка ${index + 1})`}
                  type="date"
                  fullWidth
                  size="small"
                  onChange={() => {
                    setValue(
                      `point_schedules[${index + 1}].point_index`,
                      index + 1,
                    );
                  }}
                  slotProps={{
                    htmlInput: {
                      min: dayjs().format("YYYY-MM-DD"),
                    },
                  }}
                />

                <Button
                  disabled={currentLead && !canEditStatus}
                  onClick={() => remove(index)}
                  color="error"
                  variant="outlined"
                  sx={{
                    whiteSpace: "nowrap",
                    borderRadius: 2,
                    py: 1,
                  }}
                >
                  Убрать
                </Button>
              </Box>
            ))}
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

          <FormControllerInput
            name={`point_schedules[${fields.length + 1}].start_at`}
            rules={{
              required: "Дата начала обязательна",
            }}
            control={control}
            label={`Начало (Куда)`}
            type="date"
            fullWidth
            size="small"
            onChange={() => {
              setValue(
                `point_schedules[${fields.length + 1}].point_index`,
                fields.length + 1,
              );
            }}
            slotProps={{
              htmlInput: {
                min: dayjs().format("YYYY-MM-DD"),
              },
            }}
          />

          <FormControllerInput
            name={`point_schedules[${fields.length + 1}].end_at`}
            control={control}
            rules={{
              required: "Дата оконяания обязательна",
            }}
            label={`Окончание (Куда)`}
            type="date"
            fullWidth
            size="small"
            onChange={() => {
              setValue(
                `point_schedules[${fields.length + 1}].point_index`,
                fields.length + 1,
              );
            }}
            slotProps={{
              htmlInput: {
                min: dayjs().format("YYYY-MM-DD"),
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
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          На правильные параметры города. Попытайтесь выбрать другую точку
        </Alert>
      </Snackbar>
    </StepSection>
  );
};

export default RouteStep;
