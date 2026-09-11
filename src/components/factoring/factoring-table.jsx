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
        sx={{
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

export default FactoringTable;
