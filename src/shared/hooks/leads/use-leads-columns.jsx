import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import LeadStatus from "../../ui/lead-status";
import { isDraftLead } from "../../lib/lead-draft";
import { useTranslation } from "react-i18next";

const useLeadsColumns = () => {
  const { t } = useTranslation();
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
      valueGetter: (_, row) => (isDraftLead(row) ? t("active_leads.draft") : row.status),
      headerName: t("active_leads.status"),
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
    { field: "num", headerName: t("active_leads.number"), width: 200 },
    {
      field: "driver",
      headerName: t("active_leads.driver"),
      width: 200,
      valueGetter: (_, row) => row?.driver?.fio || "",
      renderCell: ({ row }) => {
        return <Box>{row?.driver?.fio || "-"}</Box>;
      },
    },
    {
      field: "customer",
      headerName: t("active_leads.customer"),
      width: 200,
      valueGetter: (_, row) => row?.customer?.name || "",
      renderCell: ({ row }) => {
        return <Box>{row?.customer?.name || "-"}</Box>;
      },
    },
    {
      field: "to_location",
      headerName: t("active_leads.destination"),
      width: 200,
      valueGetter: (_, row) => row?.to_location?.address || row?.to || "",
      renderCell: ({ row }) => (
        <Box>{row?.to_location?.address || row?.to || t("active_leads.not_specified")}</Box>
      ),
    },
    {
      field: "from_location",
      headerName: t("active_leads.origin"),
      width: 200,
      valueGetter: (_, row) => row?.from_location?.address || row?.from || "",
      renderCell: ({ row }) => (
        <Box>{row?.from_location?.address || row?.from || t("active_leads.not_specified")}</Box>
      ),
    },
  ];

  return columns;
};

export default useLeadsColumns;
