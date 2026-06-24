import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import RenderStatus from "../../ui/render-status";
import dayjs from "dayjs";

const useFactoringColumns = () => {
  const columns = [
    {
      field: "index",
      headerName: "№",
      width: 200,
    },
    {
      field: "status",
      headerName: "Статус",
      width: 200,
      renderCell: ({ row }) => <RenderStatus status={row.status} />,
    },
    {
      field: "lead_id",
      headerName: "ID лида",
      width: 200,
    },
    {
      field: "created_at",
      headerName: "Создано",
      width: 200,
      renderCell: ({ row }) => {
        console.log("row", row);
        return <Box>{dayjs(row?.created_at?.date).format("DD-MM-YYYY")}</Box>;
      },
    },
    {
      field: "deb_summ",
      headerName: "Задолжность",
      width: 200,
      renderCell: ({ row }) => (
        <Box>
          {row?.deb_summ} {row?.deb_currency}
        </Box>
      ),
    },
    {
      field: "cred_summ",
      headerName: "Оплата за задолжность",
      width: 200,
      renderCell: ({ row }) => (
        <Box>
          {row?.cred_summ} {row?.currency}
        </Box>
      ),
    },
    {
      field: "proc_factor",
      headerName: "Процент от фактора",
      width: 200,
      renderCell: ({ row }) => (
        <Box>{(row?.proc_factor * 100).toFixed(1)} %</Box>
      ),
    },
    {
      field: "proc_service",
      headerName: "Процент от сервиса",
      width: 200,
      renderCell: ({ row }) => (
        <Box>{(row?.proc_service * 100).toFixed(1)} %</Box>
      ),
    },
  ];

  return columns;
};

export default useFactoringColumns;
