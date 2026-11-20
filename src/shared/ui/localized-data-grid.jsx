import { DataGrid } from "@mui/x-data-grid";
import { beBY, enUS, ruRU } from "@mui/x-data-grid/locales";
import { useTranslation } from "react-i18next";

export default function LocalizedDataGrid({ localeText, ...props }) {
  const { t, i18n } = useTranslation();
  const baseLocale = { be: beBY, ru: ruRU }[i18n.resolvedLanguage] || enUS;

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
