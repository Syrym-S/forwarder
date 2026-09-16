import Section from "../../../shared/ui/section";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import RoutePoint from "./route-point";
import { Box } from "@mui/material";

const LeadRouteInfo = ({ leadData }) => {
  return (
    <Section title="Маршрут" icon={<RouteOutlinedIcon color="primary" />}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr",
          },
          gap: 2,
          alignItems: "stretch",
        }}
      >
        <RoutePoint
          label="Откуда"
          address={leadData?.from_location?.address || "Битые данные"}
          status={
            leadData?.from_location?.is_passed
              ? "Точка пройдена"
              : "Точка не пройдена"
          }
          date={leadData?.point_schedules[0]}
        />

        {leadData?.waypoints?.map((point, index) => (
          <RoutePoint
            label={`Промежуточная точка #${index + 1}`}
            address={point?.address || "Битые данные"}
            status={point?.is_passed ? "Точка пройдена" : "Точка не пройдена"}
            date={leadData?.point_schedules[index + 1]}
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
          date={leadData?.point_schedules[leadData?.waypoints?.length + 1]}
        />
      </Box>
    </Section>
  );
};

export default LeadRouteInfo;
