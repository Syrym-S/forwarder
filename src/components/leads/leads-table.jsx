import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import useLeadsColumns from "../../shared/hooks/leads/use-leads-columns";
import { isDraftLead } from "../../shared/lib/lead-draft";
import { useTranslation } from "react-i18next";
import { enUS, ruRU } from "@mui/x-data-grid/locales";

const LeadsTable = ({ leads }) => {
  const { t, i18n } = useTranslation();
  const columns = useLeadsColumns();
  const baseLocale = i18n.resolvedLanguage === "ru" ? ruRU : enUS;

  return (
    <Paper sx={{ my: "10px" }}>
      <DataGrid
        hideFooter
        rows={leads}
        getRowId={(row) => row.id}
        getRowClassName={({ row }) => (isDraftLead(row) ? "lead-draft" : "")}
        columns={columns}
        checkboxSelection
        sx={{
          border: 0,
          boxShadow: 0,
          minHeight: "80vh",
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
