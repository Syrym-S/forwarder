import React from "react";
import useFactoringColumns from "../../shared/hooks/fatorings/use-factoring-columns";
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress, Paper } from "@mui/material";
import { useFactoringStore } from "../../app/store/factoring/factoring-store";

const FactoringTable = ({ factorings }) => {
  const columns = useFactoringColumns(factorings);

  const isLoading = useFactoringStore((state) => state.isLoading);

  return (
    <Paper sx={{ height: "70vh", my: "10px" }}>
      <DataGrid
        rows={factorings}
        getRowId={(row) => row.id}
        columns={columns}
        checkboxSelection
        rowHeight={70}
        localeText={{
          noRowsLabel: isLoading ? <CircularProgress /> : "Список пуст",
        }}
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default FactoringTable;
