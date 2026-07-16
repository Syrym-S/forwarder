import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import useDriversColumns from "../../shared/hooks/drivers/use-drivers-column";

const DriversTable = (drivers) => {
  const columns = useDriversColumns(drivers);

  return (
    <Paper sx={{ my: "10px" }}>
      <DataGrid
        rows={drivers.drivers}
        getRowId={(row) => row.id}
        columns={columns}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default DriversTable;
