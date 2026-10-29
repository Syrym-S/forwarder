import { useTranslation } from "react-i18next";
import { Box, Chip } from "@mui/material";
import { NavLink } from "react-router-dom";
import RenderStatus from "../../ui/render-status";

const useForwarderTenderColumns = () => {
  const { t } = useTranslation();
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 200,
      renderCell: ({ row }) => (
        <NavLink
          to={`/tenders-driver/${row.id}`}
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
      headerName: t("ui.status"),
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
    {
      field: "lead_id",
      headerName: t("ui.lead_id"),
      width: 200,
      renderCell: ({ row }) => (
        <NavLink
          to={`/leads/${row.lead_id}`}
          style={{
            textDecoration: "none",
          }}
        >
          {row.lead_id}
        </NavLink>
      ),
    },
    {
      field: "to_location",
      valueGetter: (_, row) => row?.lead?.to_location?.address || "",
      headerName: t("ui.destination"),
      width: 200,
      renderCell: ({ row }) => (
        <Box>{row?.lead?.to_location?.address || t("ui.invalid_data")}</Box>
      ),
    },
    {
      field: "from_location",
      valueGetter: (_, row) => row?.lead?.from_location?.address || "",
      headerName: t("ui.origin"),
      width: 200,
      renderCell: ({ row }) => (
        <Box>{row?.lead?.from_location?.address || t("ui.invalid_data")}</Box>
      ),
    },
    {
      field: "public_date_time",
      headerName: t("ui.publication_date"),
      width: 200,
    },
    {
      field: "end_date_time",
      headerName: t("ui.closing_date"),
      width: 200,
    },
    {
      field: "max_participants",
      headerName: t("ui.maximum_participants_3"),
      width: 200,
    },
    {
      field: "participants_count",
      headerName: t("ui.participant_count"),
      width: 200,
    },
    {
      field: "bets_count",
      headerName: t("ui.number_of_bids"),
      width: 200,
    },
    {
      field: "publication_type",
      headerName: t("ui.publication_type"),
      width: 200,
      renderCell: ({ row }) => (
        <Box>
          {row?.publication_type === "public" ? (
            <Chip label={t("ui.public")} color="primary" />
          ) : (
            <Chip label={t("ui.private")} color="primary" variant="outlined" />
          )}
        </Box>
      ),
    },
  ];

  return columns;
};

export default useForwarderTenderColumns;
