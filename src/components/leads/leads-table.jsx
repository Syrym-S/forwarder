import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import useLeadsColumns from "../../shared/hooks/leads/use-leads-columns";

const LeadsTable = (leads) => {
  const columns = useLeadsColumns(leads);

  return (
    <Paper sx={{ my: "10px", borderRadius: 0 }}>
      <DataGrid
        rows={leads.leads}
        getRowId={(row) => row.id}
        columns={columns}
        checkboxSelection
        sx={{ border: 0, minHeight: "80vh" }}
        localeText={{
          noRowsLabel: "Список лидов пуст",
        }}
      />
    </Paper>
  );
};

export default LeadsTable;
