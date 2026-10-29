import { useTranslation } from "react-i18next";
import React from "react";
import Section from "../../shared/ui/section";
import { Box } from "@mui/material";
import InfoField from "../../shared/ui/info-field";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import RenderStatus from "../../shared/ui/render-status";
import { moneySpacingFormat } from "../../shared/helpers/money-spacing";

const FactoringTransportationInfo = ({ lead }) => {
  const { t } = useTranslation();
  return (
    <Section
      title={t("ui.lead_data")}
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
          label={t("ui.origin")}
          value={
            lead?.from_location?.address ||
            lead?.from_location?.city ||
            t("ui.invalid_data")
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
          label={t("ui.destination")}
          value={
            lead?.to_location?.address ||
            lead?.to_location?.city ||
            t("ui.invalid_data")
          }
        />
      </Box>

      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3,1fr)",
            },
            gap: 2,
            mb: 2,
          }}
        >
          <InfoField
            label={t("ui.cargo_price")}
            value={`${moneySpacingFormat(lead?.price)} ${lead?.currency}`}
          />

          <InfoField
            label={t("ui.status")}
            value={<RenderStatus status={lead?.status} />}
          />

          <InfoField
            label={t("ui.cargo_description")}
            value={t("ui.lead_cargo_number", { value1: lead?.id })}
          />
        </Box>
      </Box>
    </Section>
  );
};

export default FactoringTransportationInfo;
