import { Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import DataGrid from "../../shared/ui/localized-data-grid";
import useFactoringLineColumns from "../../shared/hooks/factor-line";

const getRowHeight = () => "auto";

const FactorLineTable = ({ lines }) => {
  const { t } = useTranslation();
  const columns = useFactoringLineColumns();

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
        rows={lines}
        columns={columns}
        getRowHeight={getRowHeight}
        getEstimatedRowHeight={() => 104}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{
          border: 0,
          minWidth: 0,
          "& .MuiDataGrid-cell": { py: 1.5 },
          "& .MuiDataGrid-row:nth-of-type(even)": { bgcolor: "background.slate" },
        }}
        localeText={{ noRowsLabel: t("ui.list_empty") }}
      />
    </Paper>
  );
};

export default FactorLineTable;
