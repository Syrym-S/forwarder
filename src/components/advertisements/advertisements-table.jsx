import { Box, Button, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import DataGrid from "../../shared/ui/localized-data-grid";
import ContactValue from "../../shared/ui/contact-value";
import {
  formatAdvertisementDate,
  formatAdvertisementPrice,
  getAdvertisementAddress,
  getAdvertisementStart,
  getAdvertisementDetailsPath,
} from "../../features/advertisements/model";
import RenderStatus from "../../shared/ui/render-status";

const AdvertisementsTable = ({ advertisements, source = "my" }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const columns = [
    {
      field: "num",
      headerName: t("ui.lead_number_column"),
      width: 170,
      valueGetter: (_, row) => row.lead?.num ?? "",
      renderCell: ({ row, value }) => (
        <Button
          component={Link}
          to={getAdvertisementDetailsPath(row.id, source)}
          size="small"
        >
          №{value || "—"}
        </Button>
      ),
    },
    {
      field: "status",
      headerName: t("ui.status"),
      width: 170,
      valueGetter: (_, row) =>
        row.closed_at ? "closed" : row.lead?.status || "",
      renderCell: ({ row }) => (
        <RenderStatus status={row.closed_at ? "closed" : "active"} />
      ),
    },
    ...(source === "customer" ? [{
      field: "customer_phone",
      headerName: `${t("ui.customer")}: ${t("ui.phone_2")}`,
      width: 260,
      valueGetter: (_, row) => String(row.lead?.customer?.tel ?? "").trim(),
      renderCell: ({ value }) => value ? (
        <Box
          sx={{ width: "100%", lineHeight: 1.3 }}
          onClick={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
        >
          <ContactValue value={value} type="phone" />
        </Box>
      ) : "—",
    }] : []),
    {
      field: "from",
      headerName: t("ui.origin"),
      width: 260,
      valueGetter: (_, row) => getAdvertisementAddress(row.lead?.from_location),
    },
    {
      field: "to",
      headerName: t("ui.destination"),
      width: 260,
      valueGetter: (_, row) => getAdvertisementAddress(row.lead?.to_location),
    },
    {
      field: "start_at",
      headerName: t("ui.start_date"),
      width: 180,
      valueGetter: (_, row) => getAdvertisementStart(row.lead) || "",
      valueFormatter: (value) => formatAdvertisementDate(value),
    },
    {
      field: "price",
      headerName: t("ui.customer_price"),
      width: 180,
      type: "number",
      valueGetter: (_, row) => row.lead?.price ?? null,
      renderCell: ({ row, value }) =>
        formatAdvertisementPrice(value, row.lead?.currency),
    },
    {
      field: "transportation_price",
      headerName: t("ui.your_lead_price"),
      width: 190,
      type: "number",
      valueGetter: (_, row) => row.lead?.transportation_price ?? null,
      renderCell: ({ row, value }) =>
        formatAdvertisementPrice(value, row.lead?.currency),
    },
    {
      field: "expired_at",
      headerName: t("advertisements.expires_at"),
      width: 180,
      valueFormatter: (value) => formatAdvertisementDate(value),
    },
    {
      field: "created_at",
      headerName: t("ui.publication_date"),
      width: 180,
      valueFormatter: (value) => formatAdvertisementDate(value),
    },
    {
      field: "closed_at",
      headerName: t("ui.closing_date"),
      width: 180,
      valueFormatter: (value) => formatAdvertisementDate(value),
    },
    {
      field: "details",
      headerName: "",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Button
          component={Link}
          to={getAdvertisementDetailsPath(row.id, source)}
          size="small"
          sx={{ textTransform: "none" }}
        >
          {t("ui.details")}
        </Button>
      ),
    },
  ];

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Box sx={{ height: 560, width: "100%" }}>
        <DataGrid
          rows={advertisements}
          columns={columns}
          hideFooter
          disableRowSelectionOnClick
          onRowDoubleClick={({ row }) =>
            navigate(getAdvertisementDetailsPath(row.id, source))
          }
          sx={{
            border: 0,
            "& .MuiDataGrid-cell": { fontSize: 13 },
            '& .MuiDataGrid-cell[data-field="status"]': {
              display: "flex",
              alignItems: "center",
            },
            '& .MuiDataGrid-cell[data-field="customer_phone"]': {
              display: "flex",
              alignItems: "center",
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default AdvertisementsTable;
