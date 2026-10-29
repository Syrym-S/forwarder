import { useTranslation } from "react-i18next";
import DataGrid from "../../shared/ui/localized-data-grid";
import Paper from "@mui/material/Paper";
import useForwarderTenderColumns from "../../shared/hooks/tenders/use-forwarder-tender-columns";

const ForwardersTenderTable = (tenders) => {
  const { t } = useTranslation();
  const columns = useForwarderTenderColumns(tenders);

  return (
    <Paper sx={{ height: "70vh", my: "10px" }}>
      <DataGrid
        hideFooter
        rows={tenders.tenders}
        getRowId={(row) => row.id}
        columns={columns}
        checkboxSelection
        localeText={{
          noRowsLabel: t("ui.add_auction_empty_hint"),
        }}
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
      />
    </Paper>
  );
};

export default ForwardersTenderTable;
