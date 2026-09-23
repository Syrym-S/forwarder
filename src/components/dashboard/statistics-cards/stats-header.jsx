import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Box, TextField, Typography } from "@mui/material";
import { useStatsStore } from "../../../app/store/stats/use-stats-store";

import CustomSelect from "../../../shared/ui/input/custom-select";

const PERIOD_OPTIONS = [
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

const StatsHeader = ({ dateRange, setDateRange }) => {
  const [period, setPeriod] = useState("month");

  const getStats = useStatsStore((state) => state.getStats);

  const handlePeriodChange = (event) => {
    const value = event.target.value;

    setPeriod(value);

    if (value === "week") {
      setDateRange({
        from: dayjs().subtract(7, "day").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
      });
    }

    if (value === "month") {
      setDateRange({
        from: dayjs().startOf("month").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
      });
    }

    if (value === "year") {
      setDateRange({
        from: dayjs().startOf("year").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
      });
    }
  };

  useEffect(() => {
    if (period === "custom") {
      getStats({
        from: dateRange.from,
        to: dateRange.to,
      });
    } else {
      getStats({
        period: period,
      });
    }
  }, [period, dateRange]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "",
        alignItems: {
          xs: "flex-start",
          md: "center",
        },
        flexDirection: {
          xs: "column",
          md: "row",
        },
        gap: 2,
      }}
    >
      <Typography
        sx={{
          fontSize: {
            xs: "1.8rem",
            md: "2rem",
          },
          fontWeight: 600,
        }}
      >
        Статистика
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          width: {
            xs: "100%",
            md: "auto",
          },
        }}
      >
        <CustomSelect
          options={PERIOD_OPTIONS}
          value={period}
          onChange={handlePeriodChange}
          sx={{ width: { xs: "100%", sm: 190 } }}
        />

        {period === "custom" && (
          <>
            <TextField
              type="date"
              size="small"
              label="От"
              value={dateRange.from}
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
      </Box>
    </Box>
  );
};

export default StatsHeader;
