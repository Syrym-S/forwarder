import { useTranslation } from "react-i18next";
import Section from "../../shared/ui/section";
import { Box } from "@mui/material";
import InfoField from "../../shared/ui/info-field";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";

const TransportationInfo = ({ tender }) => {
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
            tender?.lead?.from_location?.address ||
            tender?.lead?.from_location?.city ||
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
            tender?.lead?.to_location?.address ||
            tender?.lead?.to_location?.city ||
            t("ui.invalid_data")
          }
        />
      </Box>
    </Section>
  );
};

export default TransportationInfo;
