import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { StepSection } from "../step-section";
import { useCustomerMap } from "../use-customer-map";
import { CustomerMapView } from "../map-view";
import Map from "../../dashboard/map";
import { Controller } from "react-hook-form";
import { useRouteMapPicker } from "../use-route-map-picker";
import { useEffect } from "react";
import dayjs from "dayjs";

const FirstStep = ({ control, errors, form, setValue }) => {
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
  } = useRouteMapPicker({
    form,
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
            onClick={() => setActiveMapPoint("from")}
          >
            Откуда
          </Button>

          <Button
            size="small"
            variant={activeMapPoint === "to" ? "contained" : "outlined"}
            onClick={() => setActiveMapPoint("to")}
          >
            Куда
          </Button>
        </Box>

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
            sm: "1fr 1fr",
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
