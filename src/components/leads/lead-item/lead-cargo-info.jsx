import React from "react";
import Section from "../../../shared/ui/section";
import { Box } from "@mui/material";
import InfoField from "../../../shared/ui/info-field";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import RenderStatus from "../../../shared/ui/render-status";

const LeadCargoInfo = ({ leadData }) => {
  return (
    <Section title="Груз" icon={<LocalShippingOutlinedIcon color="primary" />}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(4,1fr)",
          },
          gap: 2,
          mb: 2,
        }}
      >
        <InfoField label="Тип" value={leadData.cargo.type} />

        <InfoField
          label="Вес"
          value={
            leadData.cargo.weight_kg
              ? `${leadData.cargo.weight_kg} кг`
              : "Вес не указан"
          }
        />

        <InfoField
          label="Цена"
          value={`${leadData.cargo_price} ${leadData.currency}`}
        />

        <InfoField
          label="Статус"
          value={<RenderStatus status={leadData.status} />}
        />
      </Box>

      <InfoField label="Описание" value={`Груз заявки #${leadData.id}`} />
    </Section>
  );
};

export default LeadCargoInfo;
