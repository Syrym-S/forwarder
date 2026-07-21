import React from "react";
import { Box, Typography } from "@mui/material";
import RenderStatus from "../../shared/ui/render-status";
import Section from "../../shared/ui/section";
import InfoField from "../../shared/ui/info-field";

const FactoringCargoInfo = ({ cargo }) => {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography
        fontWeight={600}
        sx={{
          py: 1,
        }}
      >
        Груз {cargo.name}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2,1fr)",
          },
          gap: 2,
          mb: 2,
        }}
      >
        <InfoField label="Тип" value={cargo?.type} />

        <InfoField
          label="Вес"
          value={cargo?.weight_kg ? `${cargo?.weight_kg} кг` : "Вес не указан"}
        />
      </Box>

      <InfoField label="Описание" value={`${cargo?.description || "--"}`} />
    </Box>
  );
};

export default FactoringCargoInfo;
