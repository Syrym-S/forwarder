import {
  Box,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";

const numberFormat = new Intl.NumberFormat("ru-RU");
const compactFormat = new Intl.NumberFormat("ru-RU", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const monthFormat = new Intl.DateTimeFormat("ru-RU", {
  month: "short",
  year: "numeric",
});

// Детерминированные демонстрационные данные, независимые от API статистики.
const mockValue = (date, metric, indicator) => {
  const index = date.year() * 12 + date.month();
  const successful = metric === "factorings"
    ? 18 + ((index * 7) % 23)
    : 65 + ((index * 13) % 61);
  if (indicator === "money") {
    return successful * (metric === "factorings" ? 280000 : 125000)
      + ((index * 11) % 17) * 10000;
  }
  if (indicator === "exception") {
    return metric === "factorings" ? 3 + ((index * 5) % 9) : 1 + ((index * 3) % 7);
  }
  return successful;
};

const PIE_COLORS = [
  "#2563EB", "#F97316", "#10B981", "#8B5CF6", "#EAB308",
  "#EC4899", "#06B6D4", "#EF4444", "#84CC16", "#6366F1",
  "#D97706", "#14B8A6", "#A855F7",
];

const PieComparison = ({ periods, countLabel }) => {
  // Повторяющиеся в соседних парах месяцы учитываются один раз.
  const items = [...new Map(periods.map((item) => [item.label, item])).values()];
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const slices = items.map((item, index) => {
    const start = total > 0
      ? items.slice(0, index).reduce((sum, previous) => sum + previous.value, 0) / total * Math.PI * 2
      : 0;
    const share = total > 0 ? item.value / total : 0;
    const end = start + share * Math.PI * 2;
    return {
      ...item, share, color: PIE_COLORS[index % PIE_COLORS.length],
      path: `M 120 120 L ${120 + 90 * Math.sin(start)} ${120 - 90 * Math.cos(start)} A 90 90 0 ${share > 0.5 ? 1 : 0} 1 ${120 + 90 * Math.sin(end)} ${120 - 90 * Math.cos(end)} Z`,
    };
  });

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 410, height: 240 }}>
      <Box component="svg" viewBox="0 0 240 240" role="img"
        aria-label={items.map((item) => `${item.label}: ${item.value} ${countLabel}`).join(", ")}
        sx={{ width: 240, height: 240, flexShrink: 0 }}>
        <circle cx="120" cy="120" r="90" fill="#E2E8F0" />
        {slices.filter((item) => item.share > 0).map((item) => item.share >= 1 ? (
          <circle key={item.label} cx="120" cy="120" r="90" fill={item.color}>
            <title>{item.label}: {numberFormat.format(item.value)} {countLabel}</title>
          </circle>
        ) : (
          <path key={item.label} d={item.path} fill={item.color} strokeWidth="1" stroke="white">
            <title>{item.label}: {numberFormat.format(item.value)} {countLabel} ({(item.share * 100).toFixed(1)}%)</title>
          </path>
        ))}
      </Box>
      <Box component="ul" aria-label="Месяцы и цвета диаграммы"
        sx={{ listStyle: "none", m: 0, p: 0, pr: 1, flex: 1, minWidth: 150, maxHeight: 220, overflowY: "auto" }}>
        {slices.map((item) => (
          <Box component="li" key={item.label} sx={{ display: "flex", alignItems: "flex-start", gap: 1, py: 0.5 }}>
            <Box aria-hidden="true" sx={{ width: 10, height: 10, mt: 0.5, borderRadius: 0.5, bgcolor: item.color, flexShrink: 0 }} />
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{item.label}</Typography>
              <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                {numberFormat.format(item.value)} {countLabel} · {(item.share * 100).toFixed(1)}%
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const StatsComparison = ({ metric, title, countLabel }) => {
  const [months, setMonths] = useState(1);
  const [chartType, setChartType] = useState("bar");
  const [indicator, setIndicator] = useState("successful");
  const indicators = [
    { value: "money", label: "Денежные средства" },
    { value: "successful", label: "Успешно завершённые" },
    { value: "exception", label: metric === "factorings" ? "Отменённые" : "Завершённые по аварийным случаям" },
  ];
  const indicatorLabel = indicators.find((item) => item.value === indicator).label;
  const unitLabel = indicator === "money" ? "₸" : countLabel;
  const chartTitle = `${title} — ${indicatorLabel}`;
  const currentEnd = dayjs().startOf("month");
  const pairs = Array.from({ length: months }, (_, index) => {
    const current = currentEnd.subtract(months - 1 - index, "month");
    const previous = current.subtract(1, "month");
    return [previous, current].map((date, position) => ({
      label: monthFormat.format(date.toDate()),
      value: mockValue(date, metric, indicator),
      color: position === 0 ? "#94A3B8" : "#2563EB",
    }));
  });
  const periods = pairs.flat();
  const chartWidth = 60 + months * 350;
  const maximum =
    Math.ceil(Math.max(...periods.map((item) => item.value)) / 4) * 4;
  const latestPair = pairs[pairs.length - 1];
  const change =
    ((latestPair[1].value - latestPair[0].value) / latestPair[0].value) * 100;

  return (
    <Box>
      <TextField
        select
        fullWidth
        size="small"
        label="Показатель сравнения"
        value={indicator}
        onChange={(event) => setIndicator(event.target.value)}
        sx={{ mb: 2, mt: 0.5, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      >
        {indicators.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
      </TextField>
      <ToggleButtonGroup
        exclusive
        value={months}
        onChange={(_, value) => {
          if (value !== null) setMonths(value);
        }}
        size="small"
        aria-label={`Период сравнения: ${title}`}
        sx={{
          mb: 1.5,
          flexWrap: "wrap",
          "& .MuiToggleButton-root": { textTransform: "none", px: 1.5 },
        }}
      >
        <ToggleButton value={1}>Месяц</ToggleButton>
        <ToggleButton value={3}>3 месяца</ToggleButton>
        <ToggleButton value={12}>Год</ToggleButton>
      </ToggleButtonGroup>
      <Box>
        <ToggleButtonGroup
          exclusive
          value={chartType}
          onChange={(_, value) => { if (value !== null) setChartType(value); }}
          size="small"
          aria-label={`Тип графика: ${title}`}
          sx={{ mb: 1.5, "& .MuiToggleButton-root": { textTransform: "none", px: 1.5 } }}
        >
          <ToggleButton value="bar">Столбцы</ToggleButton>
          <ToggleButton value="pie">Круговая</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
        Демонстрационные данные · {indicatorLabel.toLowerCase()} · {indicator === "money" ? "KZT (₸)" : "количество"}
      </Typography>
      <Box
        key={`${months}-${chartType}`}
        tabIndex={0}
        role="region"
        aria-label={`График сравнения: ${chartTitle}. Горизонтальная прокрутка`}
        sx={{ overflowX: "auto", maxWidth: "100%", mt: 1, pb: 1 }}
      >
        {chartType === "pie" ? (
          <PieComparison periods={periods} countLabel={unitLabel} />
        ) : (
        <Box
          component="svg"
          viewBox={`0 0 ${chartWidth} 240`}
          role="img"
          aria-label={`${chartTitle}: ${periods.map((item) => `${item.label}: ${item.value} ${unitLabel}`).join(", ")}`}
          sx={{
            display: "block",
            width: "100%",
            minWidth: chartWidth,
            height: 240,
            color: "text.secondary",
          }}
        >
          {[0, 1, 2, 3, 4].map((tick) => {
            const y = 180 - tick * 36;
            return (
              <g key={tick}>
                <line
                  x1="48"
                  x2={chartWidth - 10}
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  opacity="0.15"
                />
                <text
                  x="40"
                  y={y + 4}
                  textAnchor="end"
                  fill="currentColor"
                  fontSize="11"
                >
                  {compactFormat.format((maximum * tick) / 4)}
                </text>
              </g>
            );
          })}
          {periods.map((item, index) => {
            const x = 85 + Math.floor(index / 2) * 350 + (index % 2) * 145;
            const height = (item.value / maximum) * 144;
            return (
              <g key={index}>
                <title>
                  {item.label}: {numberFormat.format(item.value)} {unitLabel}
                </title>
                <rect
                  x={x}
                  y={180 - height}
                  width="85"
                  height={height}
                  rx="6"
                  fill={item.color}
                />
                <text
                  x={x + 42.5}
                  y={170 - height}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="14"
                  fontWeight="600"
                >
                  {indicator === "money" ? `${compactFormat.format(item.value)} ₸` : numberFormat.format(item.value)}
                </text>
                <text
                  x={x + 42.5}
                  y="205"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="12"
                >
                  {item.label}
                </text>
                <text
                  x={x + 42.5}
                  y="225"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="11"
                >
                  {index % 2 === 0 ? "Предыдущий" : "Текущий"}
                </text>
              </g>
            );
          })}
        </Box>
        )}
      </Box>
      <Typography
        aria-live="polite"
        sx={{
          mt: 1.5,
          fontSize: 13,
          fontWeight: 600,
          color: change >= 0 ? "success.main" : "error.main",
        }}
      >
        {change >= 0 ? "+" : ""}
        {change.toFixed(1)}% за текущий месяц к предыдущему
      </Typography>
      <Typography sx={{ mt: 0.5, fontSize: 11, color: "text.secondary" }}>
        Каждый месяц сравнивается с предыдущим. Данные моковые.
      </Typography>
    </Box>
  );
};

export default StatsComparison;
