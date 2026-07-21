import React from "react";
import Section from "../../shared/ui/section";
import { Box } from "@mui/material";
import InfoField from "../../shared/ui/info-field";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import RenderStatus from "../../shared/ui/render-status";

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
          value={
            tender?.lead?.from_location?.address ||
            tender?.lead?.from_location?.city ||
            "Битые данные"
          }
        />

        <ArrowRightAltRoundedIcon
          sx={{
            fontSize: 40,
            color: "text.secondary",
            justifySelf: "center",
            transform: {
              xs: "rotate(90deg)",
              sm: "rotate(0deg)",
            },
          }}
        />

        <InfoField
          label="Куда"
          value={
            tender?.lead?.to_location?.address ||
            tender?.lead?.to_location?.city ||
            "Битые данные"
          }
        />
      </Box>

      <Box sx={{ py: 4 }}>
        <InfoField
          label="Статус"
          value={<RenderStatus status={tender?.lead?.status} />}
        />
      </Box>
    </Section>
  );
};

export default TransportationInfo;
