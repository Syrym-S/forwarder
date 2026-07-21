import React from "react";
import { Box } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import RenderStatus from "../../shared/ui/render-status";
import Section from "../../shared/ui/section";
import InfoField from "../../shared/ui/info-field";

const FactoringCargoInfo = ({ cargo }) => {
  return (
    <Section
      title={`Груз ${cargo?.name}`}
      icon={<LocalShippingOutlinedIcon color="primary" />}
    >
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
    </Section>
  );
};

export default FactoringCargoInfo;
