import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import LeadStatus from "../../ui/lead-status";
import { isDraftLead } from "../../lib/lead-draft";

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
      valueGetter: (_, row) => (isDraftLead(row) ? "Черновик" : row.status),
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
          <LeadStatus lead={row} />
        </Box>
      ),
    },
    { field: "num", headerName: "Номер", width: 200 },
    {
      field: "driver",
      headerName: "Водитель",
      width: 200,
      valueGetter: (_, row) => row?.driver?.fio || "",
      renderCell: ({ row }) => {
        return <Box>{row?.driver?.fio || "-"}</Box>;
      },
    },
    {
      field: "customer",
      headerName: "Заказчик",
      width: 200,
      valueGetter: (_, row) => row?.customer?.name || "",
      renderCell: ({ row }) => {
        return <Box>{row?.customer?.name || "-"}</Box>;
      },
    },
    {
      field: "to_location",
      headerName: "Куда",
      width: 200,
      valueGetter: (_, row) => row?.to_location?.address || row?.to || "",
      renderCell: ({ row }) => (
        <Box>{row?.to_location?.address || row?.to || "Не указан"}</Box>
      ),
    },
    {
      field: "from_location",
      headerName: "Откуда",
      width: 200,
      valueGetter: (_, row) => row?.from_location?.address || row?.from || "",
      renderCell: ({ row }) => (
        <Box>{row?.from_location?.address || row?.from || "Не указан"}</Box>
      ),
    },
  ];

  return columns;
};

export default useLeadsColumns;
