import { Box, Skeleton, Typography } from "@mui/material";
import CustomSelect from "../../../shared/ui/input/custom-select";
import PrimaryButton from "../../../shared/ui/button/primary-button";
import BarChartOutlined from "@mui/icons-material/BarChartOutlined";
import PieChartOutlined from "@mui/icons-material/PieChartOutlined";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useStatsStore, getAnalyticsComparison } from "../../../app/store/stats/use-stats-store";

const format = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });
const compact = new Intl.NumberFormat("ru-RU", { notation: "compact", maximumFractionDigits: 1 });
const periods = [
  { value: "week", label: "Неделя", groups: ["day"] },
  { value: "month", label: "Месяц", groups: ["week", "day"] },
  { value: "quarter", label: "Квартал", groups: ["month", "week"] },
  { value: "half_year", label: "Полугодие", groups: ["month", "quarter"] },
  { value: "year", label: "Год", groups: ["month", "quarter"] },
];
const groups = { day: "День", week: "Неделя", month: "Месяц", quarter: "Квартал" };
const indicators = [
  { value: "count", label: "Успешно завершённые" },
  { value: "emergency_count", label: "Завершённые по аварийным случаям" },
  { value: "price", label: "Денежные средства" },
  { value: "transportation_price", label: "Стоимость перевозки" },
  { value: "margin", label: "Маржа" },
];
const range = (from, to) => `${dayjs(from).format("DD.MM.YYYY")} — ${dayjs(to).format("DD.MM.YYYY")}`;

const StatsComparison = ({ title, countLabel }) => {
  const [period, setPeriod] = useState("month");
  const [groupBy, setGroupBy] = useState("week");
  const [indicator, setIndicator] = useState("count");
  const [currency, setCurrency] = useState("");
  const analytics = useStatsStore((state) => state.analytics);
  const isLoading = useStatsStore((state) => state.isAnalyticsLoading);
  const error = useStatsStore((state) => state.analyticsError);
  const getAnalytics = useStatsStore((state) => state.getAnalytics);
  useEffect(() => {
    const controller = new AbortController();
    getAnalytics({ period, group_by: groupBy }, controller.signal);
    return () => controller.abort();
  }, [period, groupBy, getAnalytics]);

  const { currencies, selectedCurrency, isMoney, current, previous, change, points } = getAnalyticsComparison(analytics, indicator, currency);
  const unit = isMoney ? selectedCurrency : countLabel;
  const maximum = Math.max(1, ...points.map((item) => Math.abs(item.value)));
  const negative = points.some((item) => item.value < 0);
  const baseline = negative ? 110 : 180;
  const scale = negative ? 70 : 144;
  const width = Math.max(410, 65 + points.length * 145);

  return (
    <Box aria-busy={isLoading}>
      <CustomSelect fullWidth label="Показатель сравнения" value={indicator} options={indicators}
        onChange={(event) => setIndicator(event.target.value)} sx={{ mb: 2, mt: 0.5 }} />
      <Box role="group" aria-label={`Период сравнения: ${title}`}
        sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, p: 0.75, mb: 2, bgcolor: "background.default", borderRadius: 2.5 }}>
        {periods.map((item) => (
          <PrimaryButton key={item.value} size="small" text={item.label}
            variant={period === item.value ? "contained" : "text"}
            aria-pressed={period === item.value} disableElevation
            onClick={() => {
              setPeriod(item.value);
              setGroupBy(item.groups[0]);
            }}
            sx={{ flex: "1 0 auto", minHeight: 36, px: 1.5, fontSize: 13, fontWeight: 500,
              ...(period !== item.value && { color: "text.secondary" }) }} />
        ))}
      </Box>
      <CustomSelect fullWidth label="Шаг графика" value={groupBy}
        options={periods.find((item) => item.value === period).groups.map((value) => ({ value, label: groups[value] }))}
        onChange={(event) => setGroupBy(event.target.value)} sx={{ mb: 2 }} />
      {isMoney && currencies.length > 0 && (
        <CustomSelect fullWidth label="Валюта" value={selectedCurrency}
          options={currencies.map((value) => ({ value, label: value }))}
          onChange={(event) => setCurrency(event.target.value)} sx={{ mb: 2 }} />
      )}
      <Box role="group" aria-label={`Тип графика: ${title}`} sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
        <PrimaryButton size="small" text="Столбцы" variant="outlined" aria-pressed={true}
          startIcon={<BarChartOutlined fontSize="small" />} sx={{ minHeight: 36, bgcolor: "background.main" }} />
        <PrimaryButton size="small" text="Круговая" variant="outlined" disabled
          startIcon={<PieChartOutlined fontSize="small" />} sx={{ minHeight: 36 }} />
      </Box>
      {isLoading ? <Skeleton variant="rounded" height={240} /> : error ? (
        <Box role="alert">
          <Typography color="error">Ошибка загрузки аналитики: {error}</Typography>
          <PrimaryButton size="small" variant="text" text="Повторить" onClick={() => getAnalytics({ period, group_by: groupBy })} />
        </Box>
      ) : analytics && (
        <>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            {indicators.find((item) => item.value === indicator).label} · {unit} · {range(analytics.from, analytics.to)}
          </Typography>
          {points.length > 0 ? (
            <Box tabIndex={0} role="region" aria-label={`График: ${title}. Горизонтальная прокрутка`}
              sx={{ overflowX: "auto", maxWidth: "100%", mt: 1 }}>
              <Box component="svg" viewBox={`0 0 ${width} 240`} role="img"
                aria-label={points.map((item) => `${range(item.from, item.to)}: ${item.value} ${unit}`).join(", ")}
                sx={{ display: "block", width: "100%", minWidth: width, height: 240, color: "text.secondary" }}>
                {(negative ? [-1, -0.5, 0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1]).map((tick) => (
                  <g key={tick}>
                    <line x1="48" x2={width - 10} y1={baseline - tick * scale} y2={baseline - tick * scale} stroke="currentColor" opacity="0.15" />
                    <text x="40" y={baseline - tick * scale + 4} textAnchor="end" fill="currentColor" fontSize="11">{compact.format(maximum * tick)}</text>
                  </g>
                ))}
                {points.map((item, index) => {
                  const x = 75 + index * 145;
                  const height = Math.abs(item.value) / maximum * scale;
                  const y = item.value < 0 ? baseline : baseline - height;
                  return (
                    <g key={item.key}>
                      <title>{range(item.from, item.to)}: {format.format(item.value)} {unit}</title>
                      <rect x={x} y={y} width="85" height={height} rx="6" fill={item.value < 0 ? "#EF4444" : "#2563EB"} />
                      <text x={x + 42.5} y={item.value < 0 ? y + height + 14 : y - 8} textAnchor="middle" fill="currentColor" fontSize="12">{compact.format(item.value)}</text>
                      <text x={x + 42.5} y="215" textAnchor="middle" fill="currentColor" fontSize="11">{dayjs(item.from).format("DD.MM")} — {dayjs(item.to).format("DD.MM")}</text>
                    </g>
                  );
                })}
              </Box>
            </Box>
          ) : <Typography sx={{ my: 2, color: "text.secondary" }}>Нет данных за выбранный период</Typography>}
          <Typography sx={{ mt: 1.5, fontSize: 13 }}>Текущий период: {format.format(current)} {unit}</Typography>
          {analytics.previous && (
            <>
              <Typography sx={{ mt: 0.5, fontSize: 13 }}>Предыдущий ({range(analytics.previous.from, analytics.previous.to)}): {format.format(previous)} {unit}</Typography>
              <Typography aria-live="polite" sx={{ mt: 1, fontSize: 13, fontWeight: 600 }}>
                {change === null ? "Изменение в процентах не рассчитывается: предыдущее значение равно нулю"
                  : `${change > 0 ? "+" : ""}${change.toFixed(1)}% к предыдущему периоду`}
              </Typography>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default StatsComparison;
