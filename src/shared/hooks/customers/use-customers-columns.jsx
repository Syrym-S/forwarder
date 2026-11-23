import { useTranslation } from "react-i18next";
import { Box, Tooltip, Typography } from "@mui/material";

const useCustomersColumns = (setSelectedCustomer) => {
  const { t } = useTranslation();
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      renderCell: (row) => (
        <Box
          sx={{
            cursor: "pointer",
          }}
          onClick={() => setSelectedCustomer(row.row)}
        >
          {row.id}
        </Box>
      ),
    },
    {
      field: "name",
      headerName: t("ui.name_2"),
      minWidth: 200,
      flex: 1,
    },
    { field: "bin", headerName: t("ui.bin"), width: 150 },
    {
      field: "type",
      headerName: t("ui.company_type"),
      width: 170,
    },
    {
      field: "legal_address",
      headerName: t("ui.address"),
      minWidth: 240,
      flex: 1.2,
    },
    {
      field: "invite_link",
      headerName: t("ui.invitation_link_2"),
      width: 220,
      renderCell: ({ value }) => (
        <Tooltip title={t("ui.click_to_copy")}>
          <Typography
            component="span"
            onClick={() => navigator.clipboard.writeText(value)}
            sx={{
              cursor: "pointer",
              display: "block",
              maxWidth: "100%",
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

export default useCustomersColumns;
