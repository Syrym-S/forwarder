import { Box, Button, IconButton, Popover, Skeleton, TextField, Tooltip, Typography } from "@mui/material";
import StatsHeader from "./stats-header";
import { useEffect, useId, useState } from "react";
import dayjs from "dayjs";
import { useStatsStore } from "../../../app/store/stats/use-stats-store";
import CustomSelect from "../../../shared/ui/input/custom-select";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import GavelOutlined from "@mui/icons-material/GavelOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";

const formatMoney = (value) => {
  if (value === null || value === undefined) return null;

  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 2,
  }).format(value);
};

const PERIOD_OPTIONS = [
  { value: "day", label: "День" },
  {
    value: "week",
    label: "Неделя",
  },
  {
    value: "month",
    label: "Месяц",
  },
  {
    value: "year",
    label: "Год",
  },
  {
    value: "custom",
    label: "Выбрать период",
  },
];

const StatCard = ({
  title,
  count = 0,
  countLabel,
  currencies = [],
  valueKey,
  emptyText,
  canBeFiltered,
  filter,
  onFilterChange,
  isLoading,
  icon: Icon = LocalShippingOutlined,
}) => {
  const [calendarAnchor, setCalendarAnchor] = useState(null);
  const [draftFilter, setDraftFilter] = useState(filter ?? {});
  const calendarId = useId();
  const isCalendarOpen = Boolean(calendarAnchor);
  const { period, from, to } = draftFilter;
  const dateRange = { from, to };
  const setDateRange = (update) => setDraftFilter((prev) => ({ ...prev, ...update(prev) }));
  const handlePeriodChange = (event) => setDraftFilter((prev) => ({ ...prev, period: event.target.value }));
  const isRangeInvalid = period === "custom" && (!from || !to || from > to);
  const applyFilter = () => {
    if (isRangeInvalid) return;
    const hasChanged = period !== filter.period || (
      period === "custom" && (from !== filter.from || to !== filter.to)
    );
    if (hasChanged) onFilterChange({ ...draftFilter });
    setCalendarAnchor(null);
  };
  const periodLabel = filter?.period === "custom"
    ? (filter.from && filter.to && filter.from <= filter.to
      ? dayjs(filter.from).format("DD.MM.YYYY") + " — " + dayjs(filter.to).format("DD.MM.YYYY")
      : "Укажите корректный период")
    : PERIOD_OPTIONS.find((option) => option.value === filter?.period)?.label;

  return (
    <Box
      aria-busy={isLoading}
      sx={{
        minWidth: 0,
        minHeight: canBeFiltered ? 220 : 190,
        p: { xs: 2, md: 2.5 },
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "#E3E8EF",
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(22, 36, 62, 0.03)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          alignItems: "center",
          mb: 2.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
          <Box sx={{ display: "grid", placeItems: "center", width: 42, height: 42, flexShrink: 0, borderRadius: 2.5, bgcolor: "background.main", color: "primary.main" }}>
            <Box component={Icon} sx={{ fontSize: 23 }} />
          </Box>
        <Typography
          title={title}
          sx={{
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "font_color.heading",
            lineHeight: 1.4,
          }}
        >
          {title}
        </Typography>
        </Box>
        {canBeFiltered && (
          <Tooltip title="Выбрать период">
            <IconButton
              aria-label={`Выбрать период: ${title}`}
              aria-haspopup="dialog"
              aria-expanded={isCalendarOpen}
              aria-controls={isCalendarOpen ? calendarId : undefined}
              onClick={(event) => {
                setDraftFilter({ ...filter });
                setCalendarAnchor(event.currentTarget);
              }}
              sx={{
                flexShrink: 0,
                width: 40,
                height: 40,
                borderRadius: 2,
                border: "1px solid",
                borderColor: isCalendarOpen ? "primary.main" : "#E3E8EF",
                color: isCalendarOpen ? "primary.main" : "color.slate_2",
                bgcolor: isCalendarOpen ? "background.main" : "background.paper",
                "&:hover": { bgcolor: "background.main", color: "primary.main" },
              }}
            >
              <CalendarMonthOutlined sx={{ fontSize: 21 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

        {canBeFiltered && (
          <Popover
            open={isCalendarOpen}
            anchorEl={calendarAnchor}
            onClose={() => setCalendarAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                id: calendarId,
                role: "dialog",
                "aria-label": `Период: ${title}`,
                sx: {
                  mt: 1,
                  width: 300,
                  maxWidth: "calc(100vw - 32px)",
                  borderRadius: 3,
                  border: "1px solid #E3E8EF",
                  boxShadow: "0 8px 32px rgba(22, 36, 62, 0.12)",
                },
              },
            }}
          >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 2,
              "& .MuiTextField-root": { width: "100%", minWidth: 0 },
              "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: "0.85rem", bgcolor: "#FAFBFD" },
            }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "font_color.heading" }}>
              Выбор периода
            </Typography>
            <CustomSelect
              options={PERIOD_OPTIONS}
              value={period}
              label="Период"
              onChange={handlePeriodChange}
            />

            {period === "custom" && (
              <>
                <TextField
                  type="date"
                  size="small"
                  label="От"
                  value={dateRange.from}
                  error={Boolean(from && to && from > to)}
                  onChange={(event) =>
                    setDateRange((prev) => ({
                      ...prev,
                      from: event.target.value,
                    }))
                  }
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />

                <TextField
                  type="date"
                  size="small"
                  label="До"
                  value={dateRange.to}
                  onChange={(event) =>
                    setDateRange((prev) => ({
                      ...prev,
                      to: event.target.value,
                    }))
                  }
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                    htmlInput: {
                      min: dateRange.from,
                    },
                  }}
                />
              </>
            )}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button onClick={() => setCalendarAnchor(null)} sx={{ textTransform: "none" }}>
                Отмена
              </Button>
              <Button
                variant="contained"
                disableElevation
                disabled={isRangeInvalid}
                onClick={applyFilter}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Применить
              </Button>
            </Box>
          </Box>
          </Popover>
        )}

      {canBeFiltered && (
        <Typography sx={{ order: 3, display: "flex", alignItems: "center", gap: 0.75, fontSize: 12, color: "text.secondary", mt: 2 }}>
          <CalendarMonthOutlined sx={{ fontSize: 16, flexShrink: 0 }} />
          За период: {periodLabel}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          gap: 1,
          mb: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{
            fontSize: canBeFiltered ? 40 : 34,
            lineHeight: 1.1,
            letterSpacing: "-0.035em",
            fontVariantNumeric: "tabular-nums",
            fontWeight: 700,
            color: "font_color.heading",
          }}
        >
          {isLoading ? <Skeleton width={50} /> : count}
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            color: "text.secondary",
          }}
        >
          {countLabel}
        </Typography>
      </Box>

      {isLoading ? <Skeleton width="45%" /> : currencies?.length > 0 ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: "auto" }}>
          {currencies.map((item) => {
            const value = valueKey ? item[valueKey] : null;

            if (value === null || value === undefined) {
              return null;
            }

            return (
              <Typography
                key={item.currency}
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "color.slate_2",
                  bgcolor: "background.default",
                  borderRadius: 1.5,
                  px: 1,
                  py: 0.5,
                  overflowWrap: "anywhere",
                  fontVariantNumeric: "tabular-nums",
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

const DashboardStats = ({ data }) => {
  const [filters, setFilters] = useState(() => {
    const initial = {
      period: "month",
      from: dayjs().startOf("month").format("YYYY-MM-DD"),
      to: dayjs().format("YYYY-MM-DD"),
    };
    return { leads: { ...initial }, factorings: { ...initial } };
  });
  const getStats = useStatsStore((state) => state.getStats);
  const isLoading = useStatsStore((state) => state.isLoading);
  const error = useStatsStore((state) => state.error);

  useEffect(() => {
    const params = {};
    for (const [key, filter] of Object.entries(filters)) {
      if (filter.period === "custom") {
        if (!filter.from || !filter.to || filter.from > filter.to) return;
        params[key + "_period_from"] = filter.from;
        params[key + "_period_to"] = filter.to;
      } else {
        params[key + "_period"] = filter.period;
      }
    }
    getStats(params).catch(() => {});
  }, [filters, getStats]);

  if (!data) return null;

  // Меняются при изменении периода
  const periodCards = [
    {
      title: "Перевозки",
      filterKey: "leads",
      count: data.leads_period?.count ?? 0,
      countLabel: "перевозка",
      currencies: data.leads_period?.currencies,
      valueKey: "price",
    },
    {
      title: "Продажи факторинга",
      filterKey: "factorings",
      icon: AccountBalanceWalletOutlined,
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
      icon: GavelOutlined,
      count: data.tenders_forwarder_active?.count ?? 0,
      countLabel: "аукционов",
    },
    {
      title: "Активные продажи факторинга",
      icon: AccountBalanceWalletOutlined,
      count: data.factorings_active?.count ?? 0,
      countLabel: "продаж",
      currencies: data.factorings_active?.currencies,
      valueKey: "sum",
    },
  ];

  return (
    <Box>
      <StatsHeader />
      {error && <Typography color="error">Ошибка загрузки: {error}</Typography>}

      {/* За выбранный период */}
      <Box sx={{ mt: 2.5 }}>
        <Typography
          sx={{
            fontSize: 13,
            color: "color.slate_2",
            fontWeight: 600,
            mb: 1.5,
          }}
        >
          За выбранный период
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
          {periodCards.map((card) => (
            <StatCard
              key={card.filterKey}
              {...card}
              canBeFiltered
              isLoading={isLoading}
              filter={filters[card.filterKey]}
              onFilterChange={(filter) => setFilters((prev) => ({
                ...prev,
                [card.filterKey]: filter,
              }))}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography
          sx={{
            fontSize: 13,
            color: "color.slate_2",
            fontWeight: 600,
            mb: 1.5,
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
          {activeCards.map((card) => (
            <StatCard key={card.title} {...card} isLoading={isLoading} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardStats;
