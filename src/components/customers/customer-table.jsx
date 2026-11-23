import { useTranslation } from "react-i18next";
import DataGrid from "../../shared/ui/localized-data-grid";
import Paper from "@mui/material/Paper";
import useCustomersColumns from "../../shared/hooks/customers/use-customers-columns";

const CustomersTable = ({ customers, setSelectedCustomer }) => {
  const { t } = useTranslation();
  const columns = useCustomersColumns(setSelectedCustomer);

  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        minWidth: 0,
        height: { xs: "min(560px, 70dvh)", md: "min(720px, 75dvh)" },
        minHeight: 320,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <DataGrid
        hideFooter
        rows={customers}
        getRowId={(row) => row.id}
        columns={columns}
        columnHeaderHeight={44}
        rowHeight={56}
        disableRowSelectionOnClick
        sx={{
          border: 0,
          boxShadow: 0,
          minWidth: 0,
          "& .MuiDataGrid-columnHeader": {
            bgcolor: "background.default",
            fontSize: 12,
          },
          "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 600 },
          "& .MuiDataGrid-cell": { fontSize: 13 },
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
