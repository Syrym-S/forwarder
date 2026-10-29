import appI18n from "../../../i18n/index.js";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import RenderStatus from "../../ui/render-status";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { renderLineColor } from "../../helpers/factoring/render-progress-line-color";
import { moneySpacingFormat } from "../../helpers/money-spacing";

const useFactoringLineColumns = () => {
  const { t } = useTranslation();
  return [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => {
        return (
          <NavLink
            to={`/factoring-lines/${row.id}/${row.factor.company_bin}-${row.factor.company_name}`}
            style={{
              textDecoration: "none",
            }}
          >
            {row.id}
          </NavLink>
        );
      },
    },
    {
      field: "status",
      headerName: t("ui.status"),
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <RenderStatus status={row.status} />
        </Box>
      ),
    },
    {
      field: "factor",
      valueGetter: (_, row) => row?.factor?.company_name || "",
      headerName: t("ui.factor"),
      width: 200,
      renderCell: ({ row }) => {
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.9rem",
              }}
            >
              {row.factor.company_name}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.7em",
                сolor: "divider",
                fontWeight: 300,
              }}
            >{t("ui.bin_value", { value1: row.factor.company_bin })}</Typography>
            <Typography
              sx={{
                fontSize: "0.7rem",
                сolor: "divider",
                fontWeight: 300,
              }}
            >
              {row.factor.fio}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.7rem",
                сolor: "divider",
                fontWeight: 300,
              }}
            >
              {row.factor.phone}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "summ_current",
      type: "number",
      valueGetter: (value) =>
        value == null || value === "" ? null : Number(value),
      headerName: t("ui.current_amount"),
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) => {
        return (
          <>
            {moneySpacingFormat(row.summ_current)} {row.currency}
          </>
        );
      },
    },
    {
      field: "progress",
      type: "number",
      valueGetter: (_, row) =>
        row.summ_max > 0
          ? Math.round((row.summ_current / row.summ_max) * 100)
          : 0,
      headerName: t("ui.progress"),
      flex: 1,
      minWidth: 300,
      renderCell: ({ value: usedPercent }) => {
        return (
          <Stack
            spacing={0.5}
            sx={{
              py: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" color="text.secondary">{t("ui.used")}</Typography>

              <Typography variant="body2" fontWeight={600}>
                {usedPercent}%
              </Typography>
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
          </Stack>
        );
      },
    },
    {
      field: "summ_max",
      type: "number",
      valueGetter: (value) =>
        value == null || value === "" ? null : Number(value),
      headerName: t("ui.maximum_amount"),
      flex: 1,
      minWidth: 180,
      renderCell: ({ row }) => {
        return (
          <>
            {moneySpacingFormat(row.summ_max)} {row.currency}
          </>
        );
      },
    },

    {
      field: "period_start",
      type: "date",
      valueGetter: (value) => {
        const date = value?.date ? new Date(value.date) : null;
        return date && !Number.isNaN(date.getTime()) ? date : null;
      },
      headerName: t("ui.start_date"),
      flex: 1,
      minWidth: 140,
      valueFormatter: (value) =>
        value?.toLocaleDateString(appI18n.resolvedLanguage) || "",
    },
    {
      field: "period_end",
      type: "date",
      valueGetter: (value) => {
        const date = value?.date ? new Date(value.date) : null;
        return date && !Number.isNaN(date.getTime()) ? date : null;
      },
      headerName: t("ui.end_date"),
      flex: 1,
      minWidth: 150,
      valueFormatter: (value) =>
        value?.toLocaleDateString(appI18n.resolvedLanguage) || "",
    },
    {
      field: "salesRelations",
      type: "number",
      headerName: t("ui.linked_sales"),
      flex: 1,
      minWidth: 150,
      valueGetter: (_, row) => row.salesRelations?.length ?? 0,
    },
  ];
};

export default useFactoringLineColumns;
