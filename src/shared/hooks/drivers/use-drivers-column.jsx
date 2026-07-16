import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import RenderStatus from "../../ui/render-status";

const useDriversColumns = () => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 200,
    },
    {
      field: "fio",
      headerName: "ФИО",
      width: 200,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "iin",
      headerName: "ИИН",
      width: 200,
    },
    {
      field: "company_name",
      headerName: "Компания",
      width: 200,
      renderCell: ({ row }) => <>{row?.company_name || "Не указан"}</>,
    },
    {
      field: "legal_address",
      headerName: "Адресс",
      width: 200,
      renderCell: ({ row }) => <>{row?.legal_address || "Не указан"}</>,
    },
  ];

  return columns;
};

export default useDriversColumns;
