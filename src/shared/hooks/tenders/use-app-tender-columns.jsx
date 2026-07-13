import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import RenderStatus from "../../ui/render-status";

const useAppTenederColumns = () => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 200,
      renderCell: ({ row }) => (
        <NavLink
          to={`/tenders/${row.id}`}
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
    {
      field: "lead",
      headerName: "ID Лида",
      width: 200,
      renderCell: ({ row }) => (
        <NavLink
          to={`/leads/${row?.lead?.id}`}
          style={{
            textDecoration: "none",
          }}
        >
          {row?.lead?.id}
        </NavLink>
      ),
    },
    {
      field: "to_location",
      headerName: "Куда",
      width: 200,
      renderCell: ({ row }) => (
        <Box>{row?.lead?.to_location?.address || "Битые данные"}</Box>
      ),
    },
    {
      field: "from_location",
      headerName: "Откуда",
      width: 200,
      renderCell: ({ row }) => (
        <Box>{row?.lead?.from_location?.address || "Битые данные"}</Box>
      ),
    },
    {
      field: "public_date_time",
      headerName: "Дата публикации",
      width: 200,
    },
    {
      field: "end_date_time",
      headerName: "Дата закрытия",
      width: 200,
    },
    {
      field: "max_participants",
      headerName: "Максимальное кол-во участников",
      width: 200,
    },
    {
      field: "participants_count",
      headerName: "Кол-во участников",
      width: 200,
    },
  ];

  return columns;
};

export default useAppTenederColumns;
