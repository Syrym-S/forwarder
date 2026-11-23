import Paper from "@mui/material/Paper";
import useLeadsColumns from "../../shared/hooks/leads/use-leads-columns";

import { DataGrid } from "@mui/x-data-grid";
import { isDraftLead } from "../../shared/lib/lead-draft";
import { useTranslation } from "react-i18next";
import { enUS, ruRU } from "@mui/x-data-grid/locales";

const LeadsTable = ({ leads, responsive = false }) => {
  const { t, i18n } = useTranslation();

  const columns = useLeadsColumns();

  const baseLocale = i18n.resolvedLanguage === "ru" ? ruRU : enUS;

  return (
    <Paper
      sx={{
        my: "10px",
        width: "100%",
        minWidth: 0,
        ...(responsive ? {
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          height: { xs: "min(560px, 70dvh)", md: "min(720px, 75dvh)" },
          minHeight: 320,
          overflow: "hidden",
        } : {}),
      }}
    >
      <DataGrid
        hideFooter
        rows={leads}
        getRowId={(row) => row.id}
        getRowClassName={({ row }) => (isDraftLead(row) ? "lead-draft" : "")}
        columns={columns}
        columnHeaderHeight={responsive ? 48 : undefined}
        rowHeight={responsive ? 60 : undefined}
        sx={{
          border: 0,
          boxShadow: 0,
          minWidth: 0,
          minHeight: responsive ? 0 : "80vh",
          ...(responsive ? {
            "& .MuiDataGrid-columnHeader": {
              bgcolor: "background.default",
              fontSize: 12,
              color: "text.secondary",
            },
            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 600 },
            "& .MuiDataGrid-cell": { fontSize: 13 },
          } : {}),
          "& .MuiDataGrid-row:nth-of-type(even)": {
            backgroundColor: "#f5f7fa",
          },

          "& .MuiDataGrid-row:nth-of-type(odd)": {
            backgroundColor: "#ffffff",
          },
          "& .MuiDataGrid-row.lead-draft": {
            backgroundColor: "#fff8e1",
            borderLeft: "3px solid",
            borderLeftColor: "warning.main",
          },
        }}
        localeText={{
          ...baseLocale.components.MuiDataGrid.defaultProps.localeText,
          ...t("active_leads.table", { returnObjects: true }),
          noRowsLabel: t("active_leads.empty_list"),
          columnMenuAriaLabel: (columnName) =>
            t("active_leads.table.columnMenuAriaLabel", { columnName }),
          columnHeaderFiltersTooltipActive: (count) =>
            t("active_leads.table.columnHeaderFiltersTooltipActive", { count }),
        }}
      />
    </Paper>
  );
};

export default LeadsTable;
