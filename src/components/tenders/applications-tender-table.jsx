import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import useAppTenederColumns from "../../shared/hooks/tenders/use-app-tender-columns";

const ApplicationsTenderTable = (tenders) => {
  const columns = useAppTenederColumns(tenders);

  return (
    <Paper sx={{ height: "70vh", my: "10px" }}>
      <DataGrid
        rows={tenders.tenders}
        getRowId={(row) => row.id}
        columns={columns}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default ApplicationsTenderTable;
