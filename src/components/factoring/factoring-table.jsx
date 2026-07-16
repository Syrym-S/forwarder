import React from "react";
import useFactoringColumns from "../../shared/hooks/fatorings/use-factoring-columns";
import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";

const FactoringTable = ({ factorings }) => {
  const columns = useFactoringColumns(factorings);

  return (
    <Paper sx={{ my: "10px" }}>
      <DataGrid
        rows={factorings}
        getRowId={(row) => row.index}
        columns={columns}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default FactoringTable;
