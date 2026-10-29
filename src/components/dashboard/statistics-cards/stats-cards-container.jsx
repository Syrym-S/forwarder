import { useTranslation } from "react-i18next";
import Tooltip from "../../../shared/ui/action-tooltip";
import {
  Box,
  Button,
  IconButton,
  Popover,
  Skeleton,
  Typography,
} from "@mui/material";
import StatsHeader from "./stats-header";
import StatsComparison from "./stats-comparison";
import BarChartOutlined from "@mui/icons-material/BarChartOutlined";
import { useEffect, useId, useState } from "react";
import dayjs from "dayjs";
import { useStatsStore } from "../../../app/store/stats/use-stats-store";
import CustomSelect from "../../../shared/ui/input/custom-select";
import FormInput from "../../../shared/ui/input/form-input";
import PrimaryButton from "../../../shared/ui/button/primary-button";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import GavelOutlined from "@mui/icons-material/GavelOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";

const formatMoney = (value, language) => {
  if (value === null || value === undefined) return null;

  return new Intl.NumberFormat(language, {
    maximumFractionDigits: 2,
  }).format(value);
};

const PERIOD_OPTIONS = [
  { value: "day", label: "dashboard.day" },
  {
    value: "week",
    label: "dashboard.week",
  },
  {
    value: "month",
    label: "dashboard.month",
  },
  {
    value: "year",
    label: "dashboard.year",
  },
  {
    value: "custom",
    label: "dashboard.select_period",
  },
];

const StatCard = ({
  title,
  count = 0,
  countLabelKey,
  currencies = [],
  valueKey,
  emptyText,
  canBeFiltered,
  filterKey,
  filter,
  onFilterChange,
  isLoading,
  icon: Icon = LocalShippingOutlined,
}) => {
  const { t, i18n } = useTranslation();
  const [isComparing, setIsComparing] = useState(false);
  const [calendarAnchor, setCalendarAnchor] = useState(null);
  const [draftFilter, setDraftFilter] = useState(filter ?? {});
  const calendarId = useId();
  const isCalendarOpen = Boolean(calendarAnchor);
  const { period, from, to } = draftFilter;
  const dateRange = { from, to };
  const setDateRange = (update) =>
    setDraftFilter((prev) => ({ ...prev, ...update(prev) }));
  const handlePeriodChange = (event) =>
    setDraftFilter((prev) => ({ ...prev, period: event.target.value }));
  const isRangeInvalid = period === "custom" && (!from || !to || from > to);
  const applyFilter = () => {
    if (isRangeInvalid) return;
    const hasChanged =
      period !== filter.period ||
      (period === "custom" && (from !== filter.from || to !== filter.to));
    if (hasChanged) onFilterChange({ ...draftFilter });
    setCalendarAnchor(null);
  };
  const periodLabel =
    filter?.period === "custom"
      ? filter.from && filter.to && filter.from <= filter.to
        ? dayjs(filter.from).format("DD.MM.YYYY") +
          " — " +
          dayjs(filter.to).format("DD.MM.YYYY")
        : t("dashboard.enter_valid_period")
      : t(PERIOD_OPTIONS.find((option) => option.value === filter?.period)?.label || "");

  return (
    <Box
      aria-busy={!isComparing && isLoading}
      sx={{
        minWidth: 0,
        minHeight: canBeFiltered ? 200 : 170,
        p: { xs: 2, md: 2.5 },
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        boxShadow: "none",
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
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}
        >
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 42,
              height: 42,
              flexShrink: 0,
              borderRadius: 2.5,
              bgcolor: "background.main",
              color: "primary.main",
            }}
          >
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
        {canBeFiltered && !isComparing && (
          <Tooltip title={t("dashboard.select_period")}>
            <IconButton
              aria-label={`${t("dashboard.select_period")}: ${title}`}
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
                bgcolor: isCalendarOpen
                  ? "background.main"
                  : "background.paper",
                "&:hover": {
                  bgcolor: "background.main",
                  color: "primary.main",
                },
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
              "aria-label": `${t("dashboard.period")}: ${title}`,
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
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                fontSize: "0.85rem",
                bgcolor: "#FAFBFD",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: "font_color.heading",
              }}
            >
              {t("dashboard.period_selection")}
            </Typography>
            <CustomSelect
              options={PERIOD_OPTIONS.map(option => ({ ...option, label: t(option.label) }))}
              value={period}
              label={t("dashboard.period")}
              onChange={handlePeriodChange}
            />

            {period === "custom" && (
              <>
                <FormInput
                  type="date"
                  size="small"
                  label={t("dashboard.from")}
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

                <FormInput
                  type="date"
                  size="small"
                  label={t("dashboard.to")}
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
              <Button
                onClick={() => setCalendarAnchor(null)}
                sx={{ textTransform: "none" }}
              >
                {t("dashboard.cancel")}
              </Button>
              <Button
                variant="contained"
                disableElevation
                disabled={isRangeInvalid}
                onClick={applyFilter}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                {t("dashboard.apply")}
              </Button>
            </Box>
          </Box>
        </Popover>
      )}

      {canBeFiltered && filterKey === "leads" && (
        <PrimaryButton
          size="small"
          text={isComparing ? t("dashboard.back_to_statistics") : t("dashboard.compare")}
          startIcon={<BarChartOutlined />}
          variant={isComparing ? "contained" : "outlined"}
          disableElevation
          aria-pressed={isComparing}
          onClick={() => setIsComparing((previous) => !previous)}
          sx={{
            alignSelf: "flex-start",
            mb: 2,
            borderRadius: 2,
            textTransform: "none",
          }}
        />
      )}

      {isComparing ? (
        <StatsComparison
          metric={filterKey}
          title={title}
          countLabelKey={countLabelKey}
        />
      ) : (
        <>
          {canBeFiltered && (
            <Typography
              sx={{
                order: 3,
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                fontSize: 12,
                color: "text.secondary",
                mt: 2,
              }}
            >
              <CalendarMonthOutlined sx={{ fontSize: 16, flexShrink: 0 }} />
              {t("dashboard.for_period")}: {periodLabel}
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
                fontSize: 32,
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
              {t(countLabelKey, { count })}
            </Typography>
          </Box>

          {isLoading ? (
            <Skeleton width="45%" />
          ) : currencies?.length > 0 ? (
            <Box
              sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: "auto" }}
            >
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
                    {formatMoney(value, i18n.resolvedLanguage)} {item.currency}
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
        </>
      )}
    </Box>
  );
};

const DashboardStats = ({ data }) => {
  const { t } = useTranslation();
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
      title: t("dashboard.completed_leads"),
      filterKey: "leads",
      count: data.leads_period?.count ?? 0,
      countLabelKey: "dashboard.lead_count",
      currencies: data.leads_period?.currencies,
      valueKey: "price",
    },
    {
      title: t("dashboard.factoring_sales"),
      filterKey: "factorings",
      icon: AccountBalanceWalletOutlined,
      count: data.factorings_period?.count ?? 0,
      countLabelKey: "dashboard.sale_count",
      currencies: data.factorings_period?.currencies,
      valueKey: "sum",
    },
  ];

  // Не зависят от периода
  const activeCards = [
    {
      id: "leads",
      title: t("dashboard.active_leads"),
      count: data.leads_active?.count ?? 0,
      countLabelKey: "dashboard.lead_count",
      currencies: data.leads_active?.currencies,
      valueKey: "price",
      emptyText: t("dashboard.no_data"),
    },
    {
      id: "auctions",
      title: t("dashboard.active_auctions"),
      icon: GavelOutlined,
      count: data.tenders_forwarder_active?.count ?? 0,
      countLabelKey: "dashboard.auction_count",
    },
    {
      id: "factorings",
      title: t("dashboard.active_factoring_sales"),
      icon: AccountBalanceWalletOutlined,
      count: data.factorings_active?.count ?? 0,
      countLabelKey: "dashboard.sale_count",
      currencies: data.factorings_active?.currencies,
      valueKey: "sum",
    },
  ];

  return (
    <Box>
      <StatsHeader />
      {error && <Typography color="error">{t("dashboard.loading_error")}: {error}</Typography>}

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
          {t("dashboard.for_selected_period")}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
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
              onFilterChange={(filter) =>
                setFilters((prev) => ({
                  ...prev,
                  [card.filterKey]: filter,
                }))
              }
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <Typography
          sx={{
            fontSize: 13,
            color: "color.slate_2",
            fontWeight: 600,
            mb: 1.5,
          }}
        >
          {t("dashboard.active_section")}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {activeCards.map((card) => (
            <StatCard key={card.id} {...card} isLoading={isLoading} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardStats;
