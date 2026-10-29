import { useTranslation } from "react-i18next";
import { Paper } from "@mui/material";
import DataGrid from "../../shared/ui/localized-data-grid";
import useFactoringLineColumns from "../../shared/hooks/factor-line";

const FactorLineTable = (factorLine) => {
  const { t } = useTranslation();
  const columns = useFactoringLineColumns();

  return (
    <Paper sx={{ my: "10px" }}>
      <DataGrid
        hideFooter
        rows={factorLine.factorLine}
        getRowId={(row) => row.id}
        columns={columns}
        rowHeight={70}
        checkboxSelection
        sx={{
          "& .MuiDataGrid-row:nth-of-type(even)": {
            backgroundColor: "#f5f7fa",
          },

          "& .MuiDataGrid-row:nth-of-type(odd)": {
            backgroundColor: "#ffffff",
          },
        }}
        localeText={{
          noRowsLabel: t("ui.list_empty"),
        }}
      />
    </Paper>
  );
};

export default FactorLineTable;
