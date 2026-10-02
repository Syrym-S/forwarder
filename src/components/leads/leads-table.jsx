import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import useLeadsColumns from "../../shared/hooks/leads/use-leads-columns";
import { isDraftLead } from "../../shared/lib/lead-draft";

const LeadsTable = ({ leads }) => {
  const columns = useLeadsColumns();

  return (
    <Paper sx={{ my: "10px" }}>
      <DataGrid
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
          noRowsLabel: "Список перевозок пуст",
        }}
      />
    </Paper>
  );
};

export default LeadsTable;
