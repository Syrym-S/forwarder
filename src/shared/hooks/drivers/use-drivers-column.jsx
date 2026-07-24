import { Box, Tooltip, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import RenderStatus from "../../ui/render-status";

const useDriversColumns = (setSelectedDriver) => {
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
          onClick={() => setSelectedDriver(row.row)}
        >
          {row.id}
        </Box>
      ),
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
    {
      field: "invite_link",
      headerName: "Пригласительная ссылка",
      width: 200,
      renderCell: ({ value }) => (
        <Tooltip title="Нажмите, чтобы скопировать">
          <Typography
            component="span"
            onClick={() => navigator.clipboard.writeText(value)}
            sx={{
              cursor: "pointer",
              color: "primary.main",
              textDecoration: "underline",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </Typography>
        </Tooltip>
      ),
    },
  ];

  return columns;
};

export default useDriversColumns;
