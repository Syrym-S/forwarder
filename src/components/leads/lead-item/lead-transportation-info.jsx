import appI18n from "../../../i18n/index.js";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import InfoItem from "../../../shared/ui/info-item";
import Section from "./lead-detail-section";

import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { transportationParameters } from "../../../shared/const/leads/transportation-parameters";
import { moneySpacingFormat } from "../../../shared/helpers/money-spacing";

const prices = [
  { name: "price", get label() { return appI18n.t("ui.customer_price"); }, color: "primary" },
  { name: "transportation_price", get label() { return appI18n.t("ui.your_lead_price"); }, color: "success" },
];

export default function LeadTransportationInfo({ leadData, hidePrices = false }) {
  const { t } = useTranslation();

  return (
    <Section
      title={hidePrices ? t("ui.lead_parameters") : t("ui.lead_cost_and_parameters")}
      icon={<PaymentsOutlinedIcon color="primary" />}
    >
      {!hidePrices && <Box
        className="lead-price-grid"
        sx={theme => ({
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))"
          },
          gap: 1.5,
          mb: 2,
          [theme.breakpoints.down("sm")]: {
            ".lead-details-page &": {
              gap: "8px",
              marginBottom: "12px"
            }
          },
          [theme.breakpoints.between(380, "sm")]: {
            ".lead-details-page &": {
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
            }
          }
        })}
      >
        {prices.map(({ name, label, color }) => {
          const value = leadData?.[name];
          const hasPrice = value != null && String(value).trim() !== "";

          return (
            <Box
              className="lead-price-card"
              key={name}
              sx={theme => ({
                minWidth: 0,
                p: {
                  xs: 2,
                  sm: 2.5
                },
                borderRadius: 2.5,
                border: "1px solid",
                borderColor: theme => alpha(theme.palette[color].main, 0.2),
                bgcolor: theme => alpha(theme.palette[color].main, 0.05),
                [theme.breakpoints.down("sm")]: {
                  ".lead-details-page &": {
                    padding: "12px",
                    borderRadius: "12px",
                    "& > .MuiTypography-root": {
                      marginBottom: "6px",
                      fontSize: "11px"
                    },
                    "& > .MuiBox-root > .MuiTypography-root:first-of-type": {
                      fontSize: "22px"
                    },
                    "& > .MuiBox-root > .MuiTypography-root:last-of-type:not(:first-of-type)": {
                      fontSize: "12px"
                    }
                  }
                },
                [theme.breakpoints.between(380, "sm")]: {
                  ".lead-details-page &": {
                    "& > .MuiBox-root": {
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "4px"
                    }
                  }
                }
              })}
            >
              <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1 }}>
                {label}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 1 }}>
                <Typography
                  sx={{
                    fontSize: hasPrice ? { xs: 24, sm: 30 } : 20,
                    fontWeight: 700,
                    color: hasPrice ? `${color}.main` : "text.secondary",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1.2,
                  }}
                >
                  {hasPrice ? moneySpacingFormat(value) : t("ui.not_specified_3")}
                </Typography>
                {hasPrice && leadData?.currency && (
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.secondary" }}>
                    {leadData.currency}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>}

      <Box
        className="lead-transport-fields"
        sx={theme => ({
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))"
          },
          gap: 1.5,
          [theme.breakpoints.down("sm")]: {
            ".lead-details-page &": {
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "8px"
            }
          }
        })}
      >
        {transportationParameters.map(({ name, label }) => (
          <InfoItem
            key={name}
            label={label}
            value={leadData?.[name]?.name || leadData?.[name] || t("ui.not_specified")}
          />
        ))}
        {leadData?.grace_period_days != null &&
          String(leadData.grace_period_days).trim() !== "" && (
            <InfoItem
              label={t("ui.available_payment_deferral")}
              value={t("ui.days_value", { value1: leadData.grace_period_days })}
            />
          )}
      </Box>
    </Section>
  );
}
