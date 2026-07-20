import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import RenderStatus from "../../ui/render-status";

const useCustomersColumns = (setSelectedCustomer) => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 200,
      renderCell: (row) => (
        <Box
          sx={{
            cursor: "pointer",
          }}
          onClick={() => setSelectedCustomer(row.row)}
        >
          {row.id}
        </Box>
      ),
    },
    {
      field: "name",
      headerName: "ИМЯ",
      width: 200,
    },
    { field: "bin", headerName: "БИН", width: 200 },
    {
      field: "type",
      headerName: "Тип компании",
      width: 200,
    },
    {
      field: "legal_address",
      headerName: "Адресс",
      width: 200,
    },
  ];

  return columns;
};

export default useCustomersColumns;
