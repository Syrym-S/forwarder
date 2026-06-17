import React from "react";
import Section from "../../shared/ui/section";
import { Box } from "@mui/material";
import InfoField from "../../shared/ui/info-field";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";

const TransportationInfo = ({ tender }) => {
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
          value={tender?.lead?.from_location?.address || "Битые данные"}
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
          value={tender?.lead?.to_location?.address || "Битые данные"}
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
          <InfoField label="Тип груза" value={tender?.lead?.cargo.type} />

          <InfoField
            label="Вес груза"
            value={
              tender?.lead?.cargo.weight_kg
                ? `${tender?.lead?.cargo.weight_kg} кг`
                : "Не указан"
            }
          />

          <InfoField
            label="Цена груза"
            value={`${tender?.lead?.cargo_price} ${tender?.lead?.currency}`}
          />

          <InfoField label="Статус" value={tender?.lead?.status} />
        </Box>

        <InfoField
          label="Описание груза"
          value={`Груз заявки #${tender?.lead?.id}`}
        />
      </Box>
    </Section>
  );
};

export default TransportationInfo;
