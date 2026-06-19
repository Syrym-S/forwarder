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
          to={`/lead-item/${row.id}`}
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
      renderCell: ({ row }) => <RenderStatus status={row.status} />,
    },
    { field: "num", headerName: "Номер", width: 200 },
    {
      field: "driver",
      headerName: "Driver",
      width: 200,
      renderCell: ({ row }) => {
        return <Box>{row?.driver?.fio || "-"}</Box>;
      },
    },
    {
      field: "to_location",
      headerName: "Куда",
      width: 200,
      renderCell: ({ row }) => (
        <Box>{row?.to_location?.address || "Битые данные"}</Box>
      ),
    },
    {
      field: "from_location",
      headerName: "Откуда",
      width: 200,
      renderCell: ({ row }) => (
        <Box>{row?.from_location?.address || "Битые данные"}</Box>
      ),
    },
  ];

  return columns;
};

export default useLeadsColumns;
