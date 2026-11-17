import { Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RenderStatus from "../../ui/render-status";
import FactoringLineProgress from "../../ui/factoring-line-progress";
import {
  formatFactoringLineAmount,
  getFactoringLineDate,
  getFactoringLinePath,
  getFactoringLineUsage,
} from "../../helpers/factoring/factoring-line";

const numericValue = (value) => {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const useFactoringLineColumns = () => {
  const { t, i18n } = useTranslation();
  const moneyColumn = (field, label, minWidth) => ({
    field,
    headerName: t(label),
    type: "number",
    flex: 1,
    minWidth,
    valueGetter: numericValue,
    renderCell: ({ row }) => formatFactoringLineAmount(row[field], row.currency),
  });
  const dateColumn = (field, label) => ({
    field,
    headerName: t(label),
    type: "date",
    flex: 1,
    minWidth: 150,
    valueGetter: getFactoringLineDate,
    valueFormatter: (value) => value?.toLocaleDateString(i18n.resolvedLanguage) || "\u2014",
  });

  return [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) => (
        <NavLink to={getFactoringLinePath(row)} style={{ textDecoration: "none" }}>
          {row.id}
        </NavLink>
      ),
    },
    {
      field: "status",
      headerName: t("ui.status"),
      flex: 1,
      minWidth: 170,
      renderCell: ({ row }) => (
        <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
          <RenderStatus status={row.status} />
        </Box>
      ),
    },
    {
      field: "factor",
      headerName: t("ui.factor"),
      minWidth: 240,
      flex: 1.5,
      valueGetter: (_, row) => row.factor?.company_name || "",
      renderCell: ({ row }) => (
        <Box sx={{ width: "100%", minWidth: 0, lineHeight: 1.4, "& .MuiTypography-root": { overflowWrap: "anywhere" } }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {row.factor?.company_name || t("ui.not_specified_2")}
          </Typography>
          {row.factor?.company_bin && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              {t("ui.bin_value", { value1: row.factor.company_bin })}
            </Typography>
          )}
          {row.factor?.fio && <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{row.factor.fio}</Typography>}
          {row.factor?.phone && <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{row.factor.phone}</Typography>}
        </Box>
      ),
    },
    moneyColumn("summ_current", "ui.current_amount", 170),
    {
      field: "progress",
      headerName: t("ui.progress"),
      type: "number",
      minWidth: 220,
      flex: 1.5,
      valueGetter: (_, row) => getFactoringLineUsage(row),
      renderCell: ({ value }) => <FactoringLineProgress percent={value} />,
    },
    moneyColumn("summ_max", "ui.maximum_amount", 180),
    dateColumn("period_start", "ui.start_date"),
    dateColumn("period_end", "ui.end_date"),
    {
      field: "salesRelations",
      headerName: t("ui.linked_sales"),
      type: "number",
      flex: 1,
      minWidth: 150,
      valueGetter: (_, row) => row.salesRelations?.length ?? 0,
    },
  ];
};

export default useFactoringLineColumns;
