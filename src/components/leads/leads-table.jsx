import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import useLeadsColumns from "../../shared/hooks/leads/use-leads-columns";

const LeadsTable = (leads) => {
  const columns = useLeadsColumns(leads);

  return (
    <Paper sx={{ height: 400, my: "10px" }}>
      <DataGrid
        rows={leads.leads}
        getRowId={(row) => row.id}
        columns={columns}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default LeadsTable;
