import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import useLeadsColumns from "../../shared/hooks/leads/use-leads-columns";

const LeadsTable = ({ leads }) => {
  const columns = useLeadsColumns();

  return (
    <Paper sx={{ my: "10px" }}>
      <DataGrid
        rows={leads}
        getRowId={(row) => row.id}
        columns={columns}
        checkboxSelection
        sx={{
          border: 0,
          boxShadow: 0,
          minHeight: "80vh",
          "& .MuiDataGrid-row:nth-of-type(even)": {
            backgroundColor: "#f5f7fa",
            borderRadius: 3,
          },

          "& .MuiDataGrid-row:nth-of-type(odd)": {
            backgroundColor: "#ffffff",
          },
        }}
        localeText={{
          noRowsLabel: "Список лидов пуст",
        }}
      />
    </Paper>
  );
};

export default LeadsTable;
