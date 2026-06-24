import React from "react";
import Section from "../../shared/ui/section";
import { Box } from "@mui/material";
import InfoField from "../../shared/ui/info-field";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import RenderStatus from "../../shared/ui/render-status";

const FactoringTransportationInfo = ({ lead }) => {
  return (
    <Section
      title="Данные перевозки"
      icon={<LocalShippingOutlinedIcon color="primary" />}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <InfoField
          label="Откуда"
          value={
            lead?.from_location?.address ||
            lead?.from_location?.city ||
            "Битые данные"
          }
        />

        <ArrowRightAltRoundedIcon
          sx={{
            fontSize: 40,
            color: "text.secondary",
            justifySelf: "center",
          }}
        />

        <InfoField
          label="Куда"
          value={
            lead?.to_location?.address ||
            lead?.to_location?.city ||
            "Битые данные"
          }
        />
      </Box>

      <Box sx={{ py: 4 }}>
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
          <InfoField label="Тип груза" value={lead?.cargo.type} />

          <InfoField
            label="Вес груза"
            value={
              lead?.cargo.weight_kg
                ? `${lead?.cargo.weight_kg} кг`
                : "Не указан"
            }
          />

          <InfoField
            label="Цена груза"
            value={`${lead?.cargo_price} ${lead?.currency}`}
          />

          <InfoField
            label="Статус"
            value={<RenderStatus status={lead?.status} />}
          />
        </Box>

        <InfoField label="Описание груза" value={`Груз заявки #${lead?.id}`} />
      </Box>
    </Section>
  );
};

export default FactoringTransportationInfo;
