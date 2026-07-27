import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import useCustomersColumns from "../../shared/hooks/customers/use-customers-columns";

const CustomersTable = ({ customers, setSelectedCustomer }) => {
  const columns = useCustomersColumns(setSelectedCustomer);

  return (
    <Paper sx={{ my: "10px" }}>
      <DataGrid
        rows={customers}
        getRowId={(row) => row.id}
        columns={columns}
        checkboxSelection
        sx={{ border: 0, minHeight: "80vh" }}
        localeText={{
          noRowsLabel: "Список заказчиков пуст",
        }}
      />
    </Paper>
  );
};

export default CustomersTable;
