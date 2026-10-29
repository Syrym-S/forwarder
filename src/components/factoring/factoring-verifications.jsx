import { useTranslation } from "react-i18next";
import { Box, Chip, Stack, Typography } from "@mui/material";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import {
  formatDate,
  getVerificationColor,
  getVerificationLabel,
} from "../../shared/helpers/factoring/factoring.helpers";
import Section from "../leads/lead-item/lead-detail-section";
import InfoBadge from "../../shared/ui/info-badge";

const FactoringVerifications = ({ factoring }) => {
  const { t } = useTranslation();
  return (
    <Section
      icon={<FactCheckOutlinedIcon color="primary" />}
      title={t("ui.confirmations")}
      subtitle={t("ui.party_confirmation_statuses")}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
          },
          gap: 1,
        }}
      >
        <Box
          sx={{
            p: 1.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "grey.50",
          }}
        >
          <Stack spacing={1}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Typography fontWeight={700}>{t("ui.customer_confirmation_2")}</Typography>

              <Chip
                size="small"
                label={getVerificationLabel(factoring.verified_customer)}
                color={getVerificationColor(factoring.verified_customer)}
                sx={{ borderRadius: 999 }}
              />
            </Box>

            <InfoBadge
              label={t("ui.confirmation_date")}
              value={formatDate(factoring.date_verified_customer)}
              fullWidth
            />
          </Stack>
        </Box>

        <Box
          sx={{
            p: 1.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "grey.50",
          }}
        >
          <Stack spacing={1}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Typography fontWeight={700}>{t("ui.forwarder_confirmation")}</Typography>

              <Chip
                size="small"
                label={getVerificationLabel(factoring.verified_forwarder)}
                color={getVerificationColor(factoring.verified_forwarder)}
                sx={{ borderRadius: 999 }}
              />
            </Box>

            <InfoBadge
              label={t("ui.confirmation_date")}
              value={formatDate(factoring.date_verified_forwarder)}
              fullWidth
            />
          </Stack>
        </Box>

        <Box
          sx={{
            p: 1.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "grey.50",
          }}
        >
          <Stack spacing={1}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Typography fontWeight={700}>{t("ui.factor_confirmation_2")}</Typography>

              <Chip
                size="small"
                label={getVerificationLabel(factoring.verified_factor)}
                color={getVerificationColor(factoring.verified_factor)}
                sx={{ borderRadius: 999 }}
              />
            </Box>

            <InfoBadge
              label={t("ui.confirmation_date")}
              value={formatDate(factoring.verified_factor)}
              fullWidth
            />
          </Stack>
        </Box>
      </Box>
    </Section>
  );
};

export default FactoringVerifications;
