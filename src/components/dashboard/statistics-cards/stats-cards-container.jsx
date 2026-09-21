import { Box, Skeleton, Typography } from "@mui/material";
import StatsHeader from "./stats-header";
import { useState } from "react";
import dayjs from "dayjs";
import { useStatsStore } from "../../../app/store/stats/use-stats-store";

const formatMoney = (value) => {
  if (value === null || value === undefined) return null;

  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 2,
  }).format(value);
};

const StatCard = ({
  title,
  count = 0,
  countLabel,
  currencies = [],
  valueKey,
  emptyText,
}) => {
  return (
    <Box
      sx={{
        minWidth: 0,
        height: 148,
        p: 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Заголовок */}
      <Typography
        title={title}
        sx={{
          fontSize: 14,
          fontWeight: 400,
          color: "text.primary",
          lineHeight: 1.3,
          mb: 0.7,

          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </Typography>

      {/* Количество */}
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          gap: 0.7,
          mb: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: 30,
            lineHeight: 1,
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          {count}
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            color: "text.primary",
          }}
        >
          {countLabel}
        </Typography>
      </Box>

      {/* Суммы */}
      {currencies?.length > 0 ? (
        <Box>
          {currencies.map((item) => {
            const value = valueKey ? item[valueKey] : null;

            if (value === null || value === undefined) {
              return null;
            }

            return (
              <Typography
                key={item.currency}
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "text.primary",
                  lineHeight: 1.5,
                }}
              >
                {formatMoney(value)} {item.currency}
              </Typography>
            );
          })}
        </Box>
      ) : (
        emptyText && (
          <Typography
            sx={{
              fontSize: 14,
              color: "text.secondary",
            }}
          >
            {emptyText}
          </Typography>
        )
      )}
    </Box>
  );
};

const StatCardSkeleton = () => {
  return (
    <Box
      sx={{
        minWidth: 0,
        height: 148,
        p: 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",

        "& .MuiSkeleton-root": {
          animation: "skeletonPulse 1s ease-in-out infinite",
        },

        "@keyframes skeletonPulse": {
          "0%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0.25,
          },
          "100%": {
            opacity: 1,
          },
        },
      }}
    >
      <Skeleton
        variant="text"
        width="65%"
        height={21}
        animation="pulse"
        sx={{ mb: 0.5 }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          gap: 1,
          mb: 0.5,
        }}
      >
        <Skeleton variant="text" width={35} height={42} animation="pulse" />

        <Skeleton variant="text" width={70} height={20} animation="pulse" />
      </Box>

      <Skeleton variant="text" width="45%" height={22} animation="pulse" />
    </Box>
  );
};

const DashboardStats = ({ data }) => {
  const [dateRange, setDateRange] = useState({
    from: dayjs().startOf("month").format("YYYY-MM-DD"),
    to: dayjs().format("YYYY-MM-DD"),
  });

  const isLoading = useStatsStore((state) => state.isLoading);

  if (!data) return null;

  // Меняются при изменении периода
  const periodCards = [
    {
      title: "Перевозки",
      count: data.leads_period?.count ?? 0,
      countLabel: "перевозка",
      currencies: data.leads_period?.currencies,
      valueKey: "price",
    },
    {
      title: "Продажи факторинга",
      count: data.factorings_period?.count ?? 0,
      countLabel: "продаж",
      currencies: data.factorings_period?.currencies,
      valueKey: "sum",
    },
  ];

  // Не зависят от периода
  const activeCards = [
    {
      title: "Активные перевозки",
      count: data.leads_active?.count ?? 0,
      countLabel: "перевозок",
      currencies: data.leads_active?.currencies,
      valueKey: "price",
      emptyText: "Нет данных",
    },
    {
      title: "Активные аукционы",
      count: data.tenders_forwarder_active?.count ?? 0,
      countLabel: "аукционов",
    },
    {
      title: "Активные продажи факторинга",
      count: data.factorings_active?.count ?? 0,
      countLabel: "продаж",
      currencies: data.factorings_active?.currencies,
      valueKey: "sum",
    },
  ];

  return (
    <Box>
      <StatsHeader dateRange={dateRange} setDateRange={setDateRange} />

      {/* За выбранный период */}
      <Box sx={{ mt: 2 }}>
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 700,
            mb: 1,
          }}
        >
          За период: {dateRange.from} - {dateRange.to}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
            },
            gap: 2,
          }}
        >
          {isLoading
            ? Array.from({ length: periodCards.length }).map((_, index) => (
                <StatCardSkeleton key={index} />
              ))
            : periodCards.map((card) => (
                <StatCard key={card.title} {...card} />
              ))}
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 700,
            mb: 1,
          }}
        >
          Активные
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {isLoading
            ? Array.from({ length: activeCards.length }).map((_, index) => (
                <StatCardSkeleton key={index} />
              ))
            : activeCards.map((card) => (
                <StatCard key={card.title} {...card} />
              ))}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardStats;
