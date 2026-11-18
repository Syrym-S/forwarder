import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RenderStatus from "../../shared/ui/render-status";
import InfoItem from "../../shared/ui/info-item";
import FactoringLineProgress from "../../shared/ui/factoring-line-progress";
import {
  formatFactoringLineAmount,
  formatFactoringLineDate,
  getFactoringLinePath,
  getFactoringLineUsage,
} from "../../shared/helpers/factoring/factoring-line";

const FactoringLineCard = ({ line }) => {
  const { t } = useTranslation();
  const amounts = [
    { label: t("ui.used"), value: line.summ_current },
    { label: t("ui.available"), value: line.summ_free },
  ];
  const dates = [
    { label: t("ui.start_date"), value: line.period_start },
    { label: t("ui.end_date"), value: line.period_end },
  ];

  return (
    <Paper
      component={Link}
      to={getFactoringLinePath(line)}
      variant="outlined"
      sx={{
        display: "block",
        p: { xs: 2, sm: 2.5 },
        width: "100%",
        minWidth: 0,
        borderRadius: 3,
        textDecoration: "none",
        color: "text.primary",
        transition: "border-color 0.2s, box-shadow 0.2s",
        "& .MuiTypography-root": { overflowWrap: "anywhere" },
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 8px 24px rgba(24, 87, 196, 0.1)",
        },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: 3,
        },
      }}
    >
      <Stack spacing={2}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
          <Typography component="h2" sx={{ fontSize: 18, fontWeight: 600 }}>
            {t("ui.factoring_line")}
          </Typography>
          <RenderStatus status={line.status} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600 }}>
            {line.factor?.company_name || t("ui.not_specified_2")}
          </Typography>
          {line.factor?.company_bin && (
            <Typography variant="caption" color="text.secondary">
              {t("ui.bin_value", { value1: line.factor.company_bin })}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            {"#" + line.id}
          </Typography>
        </Box>
        <InfoItem
          label={t("ui.maximum_amount")}
          value={formatFactoringLineAmount(line.summ_max, line.currency)}
        />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" }, gap: 1 }}>
          {amounts.map(({ label, value }) => (
            <InfoItem key={label} label={label} value={formatFactoringLineAmount(value, line.currency)} />
          ))}
        </Box>
        <FactoringLineProgress percent={getFactoringLineUsage(line)} />
        <Divider />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" }, gap: 1 }}>
          {dates.map(({ label, value }) => (
            <InfoItem key={label} label={label} value={formatFactoringLineDate(value)} />
          ))}
        </Box>
      </Stack>
    </Paper>
  );
};

export default FactoringLineCard;
