import { useTranslation } from "react-i18next";
import DataGrid from "../../shared/ui/localized-data-grid";
import Paper from "@mui/material/Paper";
import useCustomersColumns from "../../shared/hooks/customers/use-customers-columns";

const CustomersTable = ({ customers, setSelectedCustomer }) => {
  const { t } = useTranslation();
  const columns = useCustomersColumns(setSelectedCustomer);

  return (
    <Paper sx={{ my: "10px" }}>
      <DataGrid
        hideFooter
        rows={customers}
        getRowId={(row) => row.id}
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
        }}
        localeText={{
          noRowsLabel: t("ui.customer_list_empty"),
        }}
      />
    </Paper>
  );
};

export default CustomersTable;
