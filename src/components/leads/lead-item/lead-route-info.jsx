import React from "react";
import Section from "../../../shared/ui/section";
import { Box } from "@mui/material";
import InfoField from "../../../shared/ui/info-field";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";

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
        <InfoField
          label="Откуда"
          value={leadData.from_location?.address || "Битые данные"}
        />

        {leadData?.waypoints?.map((point, index) => (
          <InfoField
            label={`Промежуточная точка ${index + 1}`}
            value={point.address || "Битые данные"}
          />
        ))}

        <InfoField
          label="Куда"
          value={leadData.to_location?.address || "Битые данные"}
        />
      </Box>
    </Section>
  );
};

export default LeadRouteInfo;
