import React from "react";
import { StepSection } from "../../lead-form/step-section";
import { Box, Button, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import FormMapPicker from "../map/form-map-picker";
import { CustomerMapView } from "../../lead-form/map-view";
import { useCustomerMap } from "../../lead-form/use-customer-map";
import { useRouteMapPicker } from "../../lead-form/use-route-map-picker";

const LeadRouteStep = ({ form, control, setValue }) => {
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

  const mapPicker = useRouteMapPicker({
    form,
    setValue,
  });

  console.log(mapPicker);

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
          name="from_location"
          control={control}
          render={({ field }) => (
            <TextField fullWidth size="small" label="Откуда" />
          )}
        />
        <Controller
          name="to_location"
          control={control}
          render={({ field }) => (
            <TextField fullWidth size="small" label="Куда" />
          )}
        />
        <Controller
          name="loading_date"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              size="small"
              label="Дата загрузки"
              type="date"
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

export default LeadRouteStep;
