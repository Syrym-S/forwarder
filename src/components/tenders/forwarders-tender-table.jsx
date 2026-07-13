import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import useForwarderTenderColumns from "../../shared/hooks/tenders/use-forwarder-tender-columns";

const ForwardersTenderTable = (tenders) => {
  const columns = useForwarderTenderColumns(tenders);

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

export default ForwardersTenderTable;
