import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { transportationParameters } from "../../../shared/const/leads/transportation-parameters";
import { moneySpacingFormat } from "../../../shared/helpers/money-spacing";
import InfoItem from "../../../shared/ui/info-item";
import Section from "./lead-detail-section";

const prices = [
  { name: "price", label: "Цена заказчика", color: "primary" },
  { name: "transportation_price", label: "Ваша цена за перевозку", color: "success" },
];

export default function LeadTransportationInfo({ leadData, hidePrices = false }) {
  return (
    <Section
      title={hidePrices ? "Параметры перевозки" : "Стоимость и параметры перевозки"}
      icon={<PaymentsOutlinedIcon color="primary" />}
    >
      {!hidePrices && <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
          gap: 1.5,
          mb: 2,
        }}
      >
        {prices.map(({ name, label, color }) => {
          const value = leadData?.[name];
          const hasPrice = value != null && String(value).trim() !== "";

          return (
            <Box
              key={name}
              sx={{
                minWidth: 0,
                p: { xs: 2, sm: 2.5 },
                borderRadius: 2.5,
                border: "1px solid",
                borderColor: (theme) => alpha(theme.palette[color].main, 0.2),
                bgcolor: (theme) => alpha(theme.palette[color].main, 0.05),
              }}
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
                  {hasPrice ? moneySpacingFormat(value) : "Не указана"}
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
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.5,
        }}
      >
        {transportationParameters.map(({ name, label }) => (
          <InfoItem
            key={name}
            label={label}
            value={leadData?.[name]?.name || leadData?.[name] || "Не указан"}
          />
        ))}
        {leadData?.grace_period_days != null &&
          String(leadData.grace_period_days).trim() !== "" && (
            <InfoItem
              label="Доступная отсрочка"
              value={`${leadData.grace_period_days} дн.`}
            />
          )}
      </Box>
    </Section>
  );
}
