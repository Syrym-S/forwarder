import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import RenderStatus from "../../ui/render-status";

const useLeadsColumns = () => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 200,
      renderCell: ({ row }) => (
        <NavLink
          to={`/leads/${row.id}`}
          style={{
            textDecoration: "none",
          }}
        >
          {row.id}
        </NavLink>
      ),
    },
    {
      field: "status",
      headerName: "Статус",
      width: 200,
      renderCell: ({ row }) => (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <RenderStatus status={row.status} />
        </Box>
      ),
    },
    { field: "num", headerName: "Номер", width: 200 },
    {
      field: "driver",
      headerName: "Водитель",
      width: 200,
      renderCell: ({ row }) => {
        return <Box>{row?.driver?.fio || "-"}</Box>;
      },
    },
    {
      field: "customer",
      headerName: "Заказчик",
      width: 200,
      renderCell: ({ row }) => {
        return <Box>{row?.customer?.name || "-"}</Box>;
      },
    },
    {
      field: "to_location",
      headerName: "Куда",
      width: 200,
      renderCell: ({ row }) => (
        <Box>{row?.to_location?.address || row?.to || "Битые данные"}</Box>
      ),
    },
    {
      field: "from_location",
      headerName: "Откуда",
      width: 200,
      renderCell: ({ row }) => (
        <Box>{row?.from_location?.address || row?.to || "Битые данные"}</Box>
      ),
    },
  ];

  return columns;
};

export default useLeadsColumns;
