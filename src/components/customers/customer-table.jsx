import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import useCustomersColumns from "../../shared/hooks/customers/use-customers-columns";

const CustomersTable = (customers) => {
  const columns = useCustomersColumns(customers);

  return (
    <Paper sx={{ my: "10px" }}>
      <DataGrid
        rows={customers.customers}
        getRowId={(row) => row.id}
        columns={columns}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default CustomersTable;
