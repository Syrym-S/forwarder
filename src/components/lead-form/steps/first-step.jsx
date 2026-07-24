import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { StepSection } from "../step-section";
import { useCustomerMap } from "../use-customer-map";
import { CustomerMapView } from "../map-view";
import Map from "../../dashboard/map";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { useRouteMapPicker } from "../use-route-map-picker";
import dayjs from "dayjs";

const FirstStep = ({ control, errors, form, setValue }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "waypoints",
  });

  const waypoins = useWatch({
    control,
    name: "waypoints",
  });

  const hasWaypoint = waypoins.length !== 0;

  const handleShowFiled = () => {
    append({
      address: null,
      city: null,
      country: null,
      lat: null,
      lon: null,
      region: null,
    });
  };

  const map = useCustomerMap();

  const {
    activeMapPoint,
    loadingPoints,
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
          >
            Откуда
          </Button>
          {fields.map((_, index) => (
            <Button
              size="small"
              variant={
                activeMapPoint === `cross.${index}` ? "contained" : "outlined"
              }
              onClick={() => {
                setActiveMapPoint(`cross.${index}`);
                setCount(index);
              }}
            >
              Точка #{index + 1}
            </Button>
          ))}
          <Button
            size="small"
            variant={activeMapPoint === "to" ? "contained" : "outlined"}
            onClick={() => setActiveMapPoint("to")}
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
          >
            Добавить точку пересечения
          </Button>

          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={handleClearRoute}
            disabled={isClearDisabled}
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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: hasWaypoint ? "1fr" : "1fr 1fr",
          },
          gap: 2,
        }}
      >
        <Controller
          name="from_location.address"
          control={control}
          rules={{
            required: "Укажите место отправления",
            minLength: {
              value: 3,
              message: "Минимум 3 символа",
            },
          }}
          render={({ field }) => {
            return (
              <TextField
                {...field}
                label="Откуда"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                fullWidth
                size="small"
                disabled={loadingPoints.from}
                error={Boolean(errors.from_location?.address)}
                helperText={errors.from_location?.address?.message}
                onChange={(event) => {
                  field.onChange(event);
                  clearFromPoint();
                }}
              />
            );
          }}
        />

        {fields.map((crossField, index) => (
          <Box
            sx={{
              display: "flex",
              gap: 1,
            }}
          >
            <Controller
              key={crossField.id}
              name={`waypoints[${index}].address`}
              control={control}
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    label={`Промежуточная точка #${index + 1}`}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    fullWidth
                    size="small"
                    error={Boolean(errors.cross_location?.address)}
                    helperText={errors.cross_location?.address?.message}
                    onChange={(event) => {
                      field.onChange(event);
                      clearFromPoint();
                    }}
                  />
                );
              }}
            />
            <Button
              onClick={() => remove(index)}
              color="error"
              variant="outlined"
            >
              Убрать
            </Button>
          </Box>
        ))}

        {/* {isAddCrossPoint && (
          <Controller
            name="cross_location.address"
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  {...field}
                  label="Пересекаемая точка"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  fullWidth
                  size="small"
                  disabled={!isAddCrossPoint}
                  error={Boolean(errors.cross_location?.address)}
                  helperText={errors.cross_location?.address?.message}
                  onChange={(event) => {
                    field.onChange(event);
                    clearFromPoint();
                  }}
                />
              );
            }}
          />
        )} */}

        <Controller
          name="to_location.address"
          control={control}
          rules={{
            required: "Укажите место назначения",
            minLength: {
              value: 3,
              message: "Минимум 3 символа",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              label="Куда"
              fullWidth
              size="small"
              disabled={loadingPoints.to}
              error={Boolean(errors.to_location?.address)}
              helperText={errors.to_location?.address?.message}
              onChange={(event) => {
                field.onChange(event);
                clearToPoint();
              }}
            />
          )}
        />

        <Controller
          name="loadingDate"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              defaultValue={dayjs(form.loading_date).format("YYYY-MM-DD")}
              value={field.value}
              label="Дата загрузки"
              type="date"
              fullWidth
              size="small"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              sx={{
                gridColumn: {
                  xs: "auto",
                  sm: "1 / -1",
                },
              }}
            />
          )}
        />
      </Box>
    </StepSection>
  );
};

export default FirstStep;
