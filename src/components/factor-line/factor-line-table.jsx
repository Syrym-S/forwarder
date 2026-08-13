import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import useFactoringLineColumns from "../../shared/hooks/factor-line";

const FactorLineTable = (factorLine) => {
  const columns = useFactoringLineColumns();

  return (
    <Paper sx={{ my: "10px" }}>
      <DataGrid
        rows={factorLine.factorLine}
        getRowId={(row) => row.id}
        columns={columns}
        rowHeight={70}
        checkboxSelection
        sx={{ border: 0, minHeight: "80vh" }}
        localeText={{
          noRowsLabel: "Список пуст",
        }}
      />
    </Paper>
  );
};

export default FactorLineTable;
