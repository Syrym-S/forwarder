import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import RenderStatus from "../../shared/ui/render-status";
import { useNavigate } from "react-router-dom";
import { renderLineColor } from "../../shared/helpers/factoring/render-progress-line-color";

const formatAmount = (amount, currency) => {
  return `${new Intl.NumberFormat("ru-RU").format(amount)} ${currency}`;
};

const formatDate = (date) => {
  const [year, month, day] = date.split("-");

  return `${day}.${month}.${year}`;
};

const FactoringLineCard = ({ line }) => {
  const navigate = useNavigate();
  const {
    id,
    factor,
    status,
    summ_max,
    summ_free,
    summ_current,
    currency,
    period_start,
    period_end,
  } = line;

  const handleNavigateToDetailPage = () => {
    navigate(
      `/factoring-lines/${id}/${factor.company_bin}-${factor.company_name}`,
    );
  };

  const usedPercent =
    summ_max > 0 ? Math.round((summ_current / summ_max) * 100) : 0;

  return (
    <Box
      tabIndex={0}
      onClick={handleNavigateToDetailPage}
      sx={{
        p: 3,
        border: "2px solid",
        borderColor: "divider",
        borderRadius: 4,
        backgroundColor: "background.paper",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        transition: "0.2s ease",
        cursor: "pointer",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: "0 8px 24px rgba(33, 150, 243, 0.12)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Факторинговая линия
        </Typography>

        <RenderStatus status={status} />
      </Box>

      {/* Amounts */}
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="body2" color="text.secondary" mb={0.5}>
            Лимит
          </Typography>

          <Typography variant="h5" fontWeight={700}>
            {formatAmount(summ_max, currency)}
          </Typography>
        </Box>

        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Stack spacing={1}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  color: "#1a1a1a",
                  fontSize: "1rem",
                }}
              >
                Использовано
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  color: "#1a1a1a",
                  fontSize: "1.3rem",
                }}
              >
                {summ_current}
                {currency}
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  color: "#1a1a1a",
                  fontSize: "1rem",
                }}
              >
                Свободно
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  color: "#1a1a1a",
                  fontSize: "1.3rem",
                }}
              >
                {summ_free}
                {currency}
              </Typography>
            </Stack>
          </Box>

          <LinearProgress
            variant="determinate"
            value={usedPercent}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "grey.200",
              "& .MuiLinearProgress-bar": {
                backgroundColor: renderLineColor(usedPercent),
                borderRadius: 4,
              },
            }}
          />
        </Box>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Dates */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            Дата начала
          </Typography>

          <Typography variant="body2" fontWeight={500}>
            {formatDate(period_start.date)}
          </Typography>
        </Box>

        <Box textAlign="right">
          <Typography variant="caption" color="text.secondary">
            Дата окончания
          </Typography>

          <Typography variant="body2" fontWeight={500}>
            {formatDate(period_end.date)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FactoringLineCard;
