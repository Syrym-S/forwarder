import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import RenderStatus from "../../ui/render-status";

const useAppTenederColumns = () => {
  const { t } = useTranslation();
  const columns = [
    {
      field: "name",
      headerName: t("ui.auction_name"),
      valueGetter: (_, row) => row?.name?.trim() || t("ui.auction_name_not_set"),
      width: 200,
      renderCell: ({ row, value }) => (
        <NavLink
          to={`/tenders/${row.id}`}
          style={{
            textDecoration: "none",
          }}
        >
          {value}
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
      field: "lead_num",
      valueGetter: (_, row) => row?.lead?.num ?? t("ui.not_specified_2"),
      headerName: t("ui.lead_number_column"),
      width: 200,
      renderCell: ({ row, value }) => (
        <NavLink
          to={`/leads/${row?.lead?.id}`}
          style={{
            textDecoration: "none",
          }}
        >
          {value}
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
  ];

  return columns;
};

export default useAppTenederColumns;
