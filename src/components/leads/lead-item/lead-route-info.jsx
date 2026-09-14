import Section from "../../../shared/ui/section";
import { Box } from "@mui/material";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import RoutePoint from "./route-point";

const LeadRouteInfo = ({ leadData }) => {
  console.log(leadData);

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
        />

        {leadData?.waypoints?.map((point, index) => (
          <RoutePoint
            label={`Промежуточная точка #${index}`}
            address={point?.address || "Битые данные"}
            status={point?.is_passed ? "Точка пройдена" : "Точка не пройдена"}
          />
        ))}

        <RoutePoint
          label="Откуда"
          address={leadData?.to_location?.address || "Битые данные"}
          status={
            leadData?.to_location?.is_passed
              ? "Точка пройдена"
              : "Точка не пройдена"
          }
        />
      </Box>
    </Section>
  );
};

export default LeadRouteInfo;
