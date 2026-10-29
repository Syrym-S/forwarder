import { DataGrid } from "@mui/x-data-grid";
import { enUS, ruRU } from "@mui/x-data-grid/locales";
import { useTranslation } from "react-i18next";

export default function LocalizedDataGrid({ localeText, ...props }) {
  const { t, i18n } = useTranslation();
  const baseLocale = i18n.resolvedLanguage === "ru" ? ruRU : enUS;

  return (
    <DataGrid
      {...props}
      localeText={{
        ...baseLocale.components.MuiDataGrid.defaultProps.localeText,
        ...t("active_leads.table", { returnObjects: true }),
        columnMenuAriaLabel: (columnName) =>
          t("active_leads.table.columnMenuAriaLabel", { columnName }),
        columnHeaderFiltersTooltipActive: (count) =>
          t("active_leads.table.columnHeaderFiltersTooltipActive", { count }),
        ...localeText,
      }}
    />
  );
}
