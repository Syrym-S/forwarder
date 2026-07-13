import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import useDriversColumns from "../../shared/hooks/drivers/use-drivers-column";

const DriversTable = (drivers) => {
  const columns = useDriversColumns(drivers);

  return (
    <Paper sx={{ height: "70vh", width: "90%", my: "10px" }}>
      <DataGrid
        rows={drivers.drivers}
        getRowId={(row) => row.id}
        columns={columns}
        checkboxSelection
        sx={{ border: 0, overflowX: "scroll" }}
      />
    </Paper>
  );
};

export default DriversTable;
