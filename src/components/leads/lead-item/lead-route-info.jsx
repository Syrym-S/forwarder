import Section from "../../../shared/ui/section";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import RoutePoint from "./route-point";
import { Box } from "@mui/material";

const LeadRouteInfo = ({ leadData }) => {
  const waypoints = leadData?.waypoints || [];
  const pointSchedules = leadData?.point_schedules || [];

  return (
    <Section title="Маршрут" icon={<RouteOutlinedIcon color="primary" />}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",

          gap: {
            xs: 1,
            sm: 1.5,
            md: 2,
          },

          width: "100%",
          minWidth: 0,

          px: {
            xs: 0,
            sm: 0.5,
            md: 0,
          },
        }}
      >
        <RoutePoint
          label="Откуда"
          address={leadData?.from_location?.address || "Битые данные"}
          isPassed={leadData?.from_location?.is_passed}
          status={
            leadData?.from_location?.is_passed
              ? "Точка пройдена"
              : "Точка не пройдена"
          }
          date={pointSchedules[0]}
        />

        {waypoints.map((point, index) => (
          <RoutePoint
            key={point?.id || `${point?.address}-${index}`}
            label={`Промежуточная точка #${index + 1}`}
            address={point?.address || "Битые данные"}
            status={point?.is_passed ? "Точка пройдена" : "Точка не пройдена"}
            date={pointSchedules[index + 1]}
          />
        ))}

        <RoutePoint
          label="Куда"
          address={leadData?.to_location?.address || "Битые данные"}
          status={
            leadData?.to_location?.is_passed
              ? "Точка пройдена"
              : "Точка не пройдена"
          }
          date={pointSchedules[waypoints.length + 1]}
        />
      </Box>
    </Section>
  );
};

export default LeadRouteInfo;
