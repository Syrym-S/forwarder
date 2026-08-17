import React from "react";
import Section from "../../../shared/ui/section";
import { Box, Chip, Stack, Typography } from "@mui/material";
import InfoField from "../../../shared/ui/info-field";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import RenderStatus from "../../../shared/ui/render-status";
import RenderType from "../../../shared/ui/render-type";

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
        <Box
          sx={{
            position: "relative",
          }}
        >
          {leadData.from_location?.is_passed && (
            <Chip
              variant="contained"
              color="primary"
              size="small"
              label="Точка пройдена"
              sx={{
                position: "absolute",
                top: "-10px",
                right: 5,
              }}
            />
          )}
          <InfoField
            label={"Откуда"}
            value={leadData.from_location?.address || "Битые данные"}
            accent={leadData.from_location?.is_passed}
          />
        </Box>

        {leadData?.waypoints?.map((point, index) => (
          <Box
            sx={{
              position: "relative",
            }}
          >
            {point.is_passed && (
              <Chip
                variant="contained"
                color="primary"
                size="small"
                label="Точка пройдена"
                sx={{
                  position: "absolute",
                  top: "-10px",
                  right: 5,
                }}
              />
            )}
            <InfoField
              label={`Промежуточная точка ${index + 1}`}
              accent={point.is_passed}
              value={
                <Stack spacing={1}>
                  <Typography>{point.address || "Битые данные"}</Typography>
                  <RenderType type={point.type} />
                </Stack>
              }
            />
          </Box>
        ))}
        <Box
          sx={{
            position: "relative",
          }}
        >
          {leadData.to_location?.is_passed && (
            <Chip
              variant="contained"
              color="primary"
              size="small"
              label="Точка пройдена"
              sx={{
                position: "absolute",
                top: "-10px",
                right: 5,
              }}
            />
          )}
          <InfoField
            label="Куда"
            accent={leadData.to_location?.is_passed}
            value={leadData.to_location?.address || "Битые данные"}
          />
        </Box>
      </Box>
    </Section>
  );
};

export default LeadRouteInfo;
